/**
 * CreateChallan.jsx  — OFFICER role only
 *
 * Calls: POST /challan/create
 * Body:  ChallanRequest { vehicleNumber, violationType, fineAmount, location }
 * Returns: Challan entity { id, vehicleNumber, violationType, fineAmount,
 *                           location, status, timestamp }
 *
 * 403 response → user is not OFFICER
 */
import { useState }  from 'react'
import { api }       from '../services/api.js'
import Card          from '../components/Card.jsx'
import FormField,
       { inputStyle } from '../components/FormField.jsx'
import Alert         from '../components/Alert.jsx'
import StatusBadge   from '../components/StatusBadge.jsx'

// Violation types to match your Violation entity
const VIOLATION_TYPES = [
  'Over Speeding',
  'Red Light Jump',
  'Wrong Side Driving',
  'No Helmet',
  'No Seatbelt',
  'Drunk Driving',
  'Triple Riding',
  'No PUC Certificate',
  'Expired License',
  'Overloading',
  'Illegal Parking',
  'Mobile Use While Driving',
]

// Suggested fine amounts per violation
const FINE_SUGGESTIONS = {
  'Over Speeding':              1000,
  'Red Light Jump':             1000,
  'Wrong Side Driving':          500,
  'No Helmet':                   500,
  'No Seatbelt':                 500,
  'Drunk Driving':             10000,
  'Triple Riding':               500,
  'No PUC Certificate':          500,
  'Expired License':            5000,
  'Overloading':                2000,
  'Illegal Parking':             500,
  'Mobile Use While Driving':   1000,
}

const EMPTY_FORM = {
  vehicleNumber: '',
  violationType: VIOLATION_TYPES[0],
  fineAmount:    '',
  location:      '',
}

export default function CreateChallan({ auth, onNavigate }) {
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [receipt, setReceipt] = useState(null) // last created Challan entity

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Auto-fill fine amount when violation type changes
  function handleViolationChange(v) {
    set('violationType', v)
    if (FINE_SUGGESTIONS[v]) set('fineAmount', String(FINE_SUGGESTIONS[v]))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setReceipt(null)
    setLoading(true)
    try {
      // POST /challan/create
      const challan = await api.createChallan(
        { ...form, fineAmount: parseFloat(form.fineAmount) },
        auth.token
      )
      setReceipt(challan)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError(
        err.message.includes('403')
          ? 'Access denied. Only OFFICERs can create challans.'
          : err.message || 'Failed to create challan.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={btnBack}
        >← Back</button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Create Challan</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
            Issue a new traffic violation — OFFICER access only
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 860 }}>

        {/* ── Form card ── */}
        <Card>
          <h3 style={cardTitle}>Challan Details</h3>
          <Alert type="error" message={error} />

          <form onSubmit={handleSubmit}>
            <FormField label="Vehicle Number *">
              <input
                style={inputStyle}
                placeholder="e.g. MH12AB1234"
                value={form.vehicleNumber}
                onChange={e => set('vehicleNumber', e.target.value.toUpperCase())}
                required
                pattern="[A-Z0-9]+"
                title="Uppercase letters and digits only"
              />
            </FormField>

            <FormField label="Violation Type *">
              <select
                style={inputStyle}
                value={form.violationType}
                onChange={e => handleViolationChange(e.target.value)}
              >
                {VIOLATION_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </FormField>

            <FormField label="Fine Amount (₹) *">
              <input
                style={inputStyle}
                type="number"
                placeholder="e.g. 1000"
                value={form.fineAmount}
                onChange={e => set('fineAmount', e.target.value)}
                required min="1" step="0.01"
              />
            </FormField>

            <FormField label="Location *">
              <input
                style={inputStyle}
                placeholder="e.g. MG Road, near Signal No. 4"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                required
              />
            </FormField>

            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button
                type="submit"
                disabled={loading}
                style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Issuing…' : '✓  Issue Challan'}
              </button>
              <button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                style={btnSecondary}
              >Clear</button>
            </div>
          </form>
        </Card>

        {/* ── Receipt card ── */}
        <Card>
          <h3 style={cardTitle}>Challan Receipt</h3>
          {receipt ? (
            <>
              <Alert type="success" message="Challan issued successfully!" />
              {[
                ['Challan ID',     `#${receipt.id}`],
                ['Vehicle Number', receipt.vehicleNumber],
                ['Violation',      receipt.violationType],
                ['Fine Amount',    `₹${(receipt.fineAmount || 0).toLocaleString('en-IN')}`],
                ['Location',       receipt.location],
                ['Issued At',      receipt.timestamp
                  ? new Date(receipt.timestamp).toLocaleString('en-IN')
                  : '—'],
              ].map(([k, v]) => (
                <div key={k} style={receiptRow}>
                  <span style={receiptKey}>{k}</span>
                  <span style={receiptVal}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <StatusBadge status={receipt.status || 'PENDING'} />
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#d1d5db' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
              <p style={{ fontSize: 13 }}>Receipt will appear after issuing</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ─── Local styles ─────────────────────────────────────────────────────────────
const cardTitle  = { margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#111827' }
const receiptRow = { display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6' }
const receiptKey = { fontSize: 13, color: '#6b7280' }
const receiptVal = { fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right' }

const btnPrimary   = { background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 700 }
const btnSecondary = { background: '#fff', color: '#6b7280', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '11px 18px', cursor: 'pointer', fontSize: 14 }
const btnBack      = { background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#6b7280', fontWeight: 600 }
