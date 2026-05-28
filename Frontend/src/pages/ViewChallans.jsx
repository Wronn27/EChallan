/**
 * ViewChallans.jsx
 *
 * ADMIN  → GET /challan/all         (auto-loads all challans)
 * OFFICER → GET /challan/vehicle/{n} (search by vehicle number)
 * CITIZEN → GET /challan/vehicle/{n} (search their own vehicle)
 */
import { useState, useEffect } from 'react'
import { api }        from '../services/api.js'
import Card           from '../components/Card.jsx'
import Alert          from '../components/Alert.jsx'
import { ChallanTable } from './Dashboard.jsx'

export default function ViewChallans({ auth }) {
  const { token, role } = auth
  const isAdmin = role === 'ADMIN'

  const [challans,       setChallans]       = useState([])
  const [vehicleInput,   setVehicleInput]   = useState('')
  const [loading,        setLoading]        = useState(false)
  const [searched,       setSearched]       = useState(false)
  const [error,          setError]          = useState('')
  const [statusFilter,   setStatusFilter]   = useState('ALL')

  // ADMIN: load everything on mount
  useEffect(() => {
    if (isAdmin) {
      setLoading(true)
      api.getAllChallans(token)
        .then(d => { setChallans(Array.isArray(d) ? d : []); setSearched(true) })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    if (!vehicleInput.trim()) return
    setError(''); setLoading(true); setSearched(false)
    try {
      // GET /challan/vehicle/{vehicleNumber}
      const data = await api.getChallansByVehicle(vehicleInput.trim().toUpperCase(), token)
      setChallans(Array.isArray(data) ? data : [])
      setSearched(true)
    } catch (err) {
      setError(
        err.message.includes('403')
          ? 'You do not have permission to view these challans.'
          : err.message || 'Search failed.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Client-side status filter
  const filtered = statusFilter === 'ALL'
    ? challans
    : challans.filter(c => (c.status || 'PENDING') === statusFilter)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
          {isAdmin ? 'All Challans' : 'Search Challans'}
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          {isAdmin
            ? 'Every challan in the system'
            : 'Enter a vehicle registration number to look up challans'}
        </p>
      </div>

      {/* Search bar — CITIZEN + OFFICER */}
      {!isAdmin && (
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 520 }}>
          <input
            style={{
              flex: 1, padding: '11px 16px',
              border: '1.5px solid #e5e7eb', borderRadius: 9,
              fontSize: 15, color: '#111827', background: '#fff',
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
            }}
            placeholder="Vehicle number — e.g. MH12AB1234"
            value={vehicleInput}
            onChange={e => setVehicleInput(e.target.value.toUpperCase())}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#3b4fd8', color: '#fff',
              border: 'none', borderRadius: 9,
              padding: '11px 26px', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
              opacity: loading ? 0.7 : 1,
            }}
          >{loading ? 'Searching…' : '🔍  Search'}</button>
        </form>
      )}

      <Alert type="error" message={error} />

      {/* Results */}
      {searched && !loading && (
        <Card style={{ padding: 0 }}>
          {/* Table toolbar */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>
              {filtered.length} challan{filtered.length !== 1 ? 's' : ''}
              {!isAdmin && vehicleInput && ` for ${vehicleInput}`}
            </span>

            {/* Status filter pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['ALL', 'PENDING', 'PAID'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '5px 14px', borderRadius: 20, border: '1.5px solid',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: statusFilter === s ? '#3b4fd8' : 'transparent',
                    color:      statusFilter === s ? '#fff'     : '#6b7280',
                    borderColor: statusFilter === s ? '#3b4fd8' : '#e5e7eb',
                    transition: 'all 0.15s',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0
            ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#d1d5db' }}>
                <div style={{ fontSize: 44 }}>🚗</div>
                <p style={{ marginTop: 12, fontSize: 14 }}>No challans found.</p>
              </div>
            )
            : <ChallanTable challans={filtered} />
          }
        </Card>
      )}

      {/* Empty state before first search */}
      {!searched && !loading && !isAdmin && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#d1d5db' }}>
          <div style={{ fontSize: 56 }}>🔍</div>
          <p style={{ marginTop: 14, fontSize: 14, color: '#9ca3af' }}>
            Enter a vehicle number above to find challans
          </p>
        </div>
      )}

      {loading && isAdmin && (
        <div style={{ color: '#9ca3af', padding: '40px 0', textAlign: 'center' }}>Loading challans…</div>
      )}
    </div>
  )
}
