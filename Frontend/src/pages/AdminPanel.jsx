/**
 * AdminPanel.jsx  — ADMIN role only
 *
 * Loads: GET /challan/all  → List<Challan>
 *
 * Computes client-side:
 *   - total / pending / paid counts  (mirrors ChallanRepository.countByStatus)
 *   - total fines issued
 *   - top violation types (bar chart)
 *   - collection rate donut
 *
 * 403 if user is not ADMIN.
 */
import { useState, useEffect } from 'react'
import { api }       from '../services/api.js'
import Card          from '../components/Card.jsx'
import Alert         from '../components/Alert.jsx'
import StatusBadge   from '../components/StatusBadge.jsx'
import { ChallanTable } from './Dashboard.jsx'

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb',
      borderRadius: 14, padding: '18px 20px',
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>{label}</div>
    </div>
  )
}

// ─── Horizontal bar ───────────────────────────────────────────────────────────
function Bar({ label, count, max, color }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: '#374151', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontWeight: 700, color, minWidth: 24, textAlign: 'right' }}>{count}</span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8 }}>
        <div style={{
          background: color, borderRadius: 4,
          height: 8, width: `${pct}%`,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

// ─── Donut SVG ────────────────────────────────────────────────────────────────
function Donut({ paid, total }) {
  const r   = 52
  const circ = 2 * Math.PI * r
  const pct  = total > 0 ? paid / total : 0
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#f3f4f6" strokeWidth="16" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke="#16a34a" strokeWidth="16"
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="70" y="66" textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827" fontFamily="DM Sans, sans-serif">
        {Math.round(pct * 100)}%
      </text>
      <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="DM Sans, sans-serif">
        paid
      </text>
    </svg>
  )
}

// ─── AdminPanel ───────────────────────────────────────────────────────────────
export default function AdminPanel({ auth }) {
  const [challans, setChallans] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    // GET /challan/all — ADMIN only
    api.getAllChallans(auth.token)
      .then(d => setChallans(Array.isArray(d) ? d : []))
      .catch(e => setError(
        e.message.includes('403') ? 'Admin access required.' : e.message
      ))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: '#9ca3af', padding: '60px 0', textAlign: 'center' }}>Loading analytics…</div>

  if (error) return (
    <div style={{ maxWidth: 500 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 20 }}>Analytics</h1>
      <Alert type="error" message={error} />
    </div>
  )

  // ── Compute stats ──────────────────────────────────────────────────────────
  const total      = challans.length
  const pending    = challans.filter(c => (c.status || 'PENDING') === 'PENDING').length
  const paid       = challans.filter(c => c.status === 'PAID').length
  const totalFines = challans.reduce((s, c) => s + (c.fineAmount || 0), 0)
  const collectionRate = total > 0 ? Math.round((paid / total) * 100) : 0

  // Violation frequency map
  const violationMap = {}
  challans.forEach(c => {
    const v = c.violationType || 'Other'
    violationMap[v] = (violationMap[v] || 0) + 1
  })
  const topViolations = Object.entries(violationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
  const maxViolationCount = topViolations[0]?.[1] || 1

  // Bar colors
  const BAR_COLORS = ['#3b4fd8', '#0891b2', '#7c3aed', '#16a34a', '#ea580c', '#db2777', '#ca8a04']

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>System-wide overview — ADMIN only</p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 16, marginBottom: 26,
      }}>
        <StatCard icon="📋" label="Total Challans"     value={total}                                   accent="#3b4fd8" />
        <StatCard icon="⏳" label="Pending"             value={pending}                                 accent="#ea580c" />
        <StatCard icon="✅" label="Paid"                value={paid}                                    accent="#16a34a" />
        <StatCard icon="₹"  label="Total Fines Issued" value={`₹${totalFines.toLocaleString('en-IN')}`} accent="#7c3aed" />
        <StatCard icon="📈" label="Collection Rate"    value={`${collectionRate}%`}                    accent="#0891b2" />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 26 }}>

        {/* Violations bar chart */}
        <Card>
          <h3 style={cardTitle}>Top Violations</h3>
          {topViolations.length === 0
            ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No data yet.</p>
            : topViolations.map(([type, count], i) => (
                <Bar key={type} label={type} count={count} max={maxViolationCount} color={BAR_COLORS[i % BAR_COLORS.length]} />
              ))
          }
        </Card>

        {/* Collection donut */}
        <Card>
          <h3 style={cardTitle}>Collection Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative' }}>
              <Donut paid={paid} total={total} />
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Paid',    count: paid,    bg: '#f0fdf4', col: '#16a34a' },
                { label: 'Pending', count: pending, bg: '#fff7ed', col: '#ea580c' },
              ].map(({ label, count, bg, col }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: bg, borderRadius: 8,
                  padding: '10px 14px', marginBottom: 10,
                }}>
                  <span style={{ fontSize: 13, color: col, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: col }}>{count}</span>
                </div>
              ))}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f8f9ff', borderRadius: 8, padding: '10px 14px',
              }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Revenue</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#3b4fd8', fontFamily: 'DM Mono, monospace' }}>
                  ₹{totalFines.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Full challan table ── */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>
            All Challans ({total})
          </h3>
        </div>
        {challans.length === 0
          ? <div style={{ textAlign: 'center', padding: '50px 0', color: '#9ca3af' }}>No challans in the system yet.</div>
          : <ChallanTable challans={challans} />
        }
      </Card>
    </div>
  )
}

const cardTitle = { margin: '0 0 18px', fontSize: 15, fontWeight: 700, color: '#111827' }
