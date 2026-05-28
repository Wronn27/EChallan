/**
 * PaymentPage.jsx  — CITIZEN role only
 *
 * Flow:
 *   Step 1 → Enter challan ID → GET /challan/id/{id}  (lookup + show details)
 *   Step 2 → Confirm → POST /payment/pay { challanId, amount }
 *   Step 3 → Show Payment entity receipt
 *
 * PaymentRequest DTO: { challanId (Long), amount (Double) }
 * Payment entity:     { id, challanId, amount, status, paymentTime }
 */
import { useState }   from 'react'
import { api }        from '../services/api.js'
import Card           from '../components/Card.jsx'
import Alert          from '../components/Alert.jsx'
import StatusBadge    from '../components/StatusBadge.jsx'

// ─── Small step indicator ────────────────────────────────────────────────────
function StepHeader({ number, title, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: done ? '#16a34a' : '#3b4fd8',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 14, flexShrink: 0,
      }}>{done ? '✓' : number}</div>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{title}</span>
    </div>
  )
}

// ─── Key-value detail row ────────────────────────────────────────────────────
function DetailRow({ label, value, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '9px 0', borderBottom: '1px solid #f3f4f6',
    }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: '#111827',
        fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
      }}>{value}</span>
    </div>
  )
}

// ─── PaymentPage ─────────────────────────────────────────────────────────────
export default function PaymentPage({ auth }) {
  // Step 1 state
  const [challanId,     setChallanId]     = useState('')
  const [challan,       setChallan]       = useState(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError,   setLookupError]   = useState('')

  // Step 2 state
  const [payment,     setPayment]     = useState(null)
  const [payLoading,  setPayLoading]  = useState(false)
  const [payError,    setPayError]    = useState('')

  // ── Step 1: look up challan by ID ─────────────────────────────────────────
  async function handleLookup(e) {
    e.preventDefault()
    setLookupError(''); setChallan(null); setPayment(null); setPayError('')
    setLookupLoading(true)
    try {
      // GET /challan/id/{challanId}
      const data = await api.getChallanById(challanId, auth.token)
      setChallan(data)
    } catch (err) {
      setLookupError(
        err.message.includes('404') ? `Challan #${challanId} not found.`
        : err.message.includes('403') ? 'Access denied.'
        : err.message || 'Lookup failed.'
      )
    } finally {
      setLookupLoading(false)
    }
  }

  // ── Step 2: pay the challan ───────────────────────────────────────────────
  async function handlePay() {
    if (!challan) return
    setPayError(''); setPayLoading(true)
    try {
      // POST /payment/pay  { challanId: Long, amount: Double }
      const result = await api.payChallan(challan.id, challan.fineAmount, auth.token)
      setPayment(result)
      setChallan(prev => ({ ...prev, status: 'PAID' }))
    } catch (err) {
      setPayError(
        err.message.includes('403')
          ? 'Only CITIZENs can pay challans.'
          : err.message || 'Payment failed. Please try again.'
      )
    } finally {
      setPayLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Pay Challan</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          Enter your challan ID to look it up and pay the fine online
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>

        {/* ── Step 1: Lookup ── */}
        <Card>
          <StepHeader number="1" title="Find Your Challan" done={!!challan} />
          <Alert type="error" message={lookupError} />

          <form onSubmit={handleLookup} style={{ display: 'flex', gap: 12 }}>
            <input
              style={{
                flex: 1, padding: '11px 16px',
                border: '1.5px solid #e5e7eb', borderRadius: 9,
                fontSize: 15, color: '#111827', background: '#f9fafb',
                fontFamily: 'DM Mono, monospace',
              }}
              type="number"
              placeholder="Challan ID — e.g. 101"
              value={challanId}
              onChange={e => setChallanId(e.target.value)}
              required min="1"
            />
            <button
              type="submit"
              disabled={lookupLoading}
              style={{
                background: '#3b4fd8', color: '#fff',
                border: 'none', borderRadius: 9,
                padding: '11px 24px', cursor: 'pointer',
                fontSize: 14, fontWeight: 700,
                opacity: lookupLoading ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >{lookupLoading ? 'Looking up…' : 'Find Challan'}</button>
          </form>

          {/* Challan details shown after lookup */}
          {challan && (
            <div style={{ marginTop: 22 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 16,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Challan Details
                </span>
                <StatusBadge status={challan.status || 'PENDING'} />
              </div>
              <DetailRow label="Challan ID"     value={`#${challan.id}`}    mono />
              <DetailRow label="Vehicle Number" value={challan.vehicleNumber} mono />
              <DetailRow label="Violation"      value={challan.violationType} />
              <DetailRow label="Location"       value={challan.location || '—'} />
              <DetailRow
                label="Issued On"
                value={challan.timestamp
                  ? new Date(challan.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              />

              {/* Amount box */}
              <div style={{
                marginTop: 18,
                background: challan.status === 'PAID' ? '#f0fdf4' : '#fff7ed',
                border: `1.5px solid ${challan.status === 'PAID' ? '#bbf7d0' : '#fed7aa'}`,
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                  {challan.status === 'PAID' ? 'Amount Paid' : 'Amount Due'}
                </span>
                <span style={{
                  fontSize: 28, fontWeight: 800,
                  color: challan.status === 'PAID' ? '#16a34a' : '#ea580c',
                  fontFamily: 'DM Mono, monospace',
                }}>
                  ₹{(challan.fineAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* ── Step 2: Pay ── */}
        {challan && (
          <Card>
            <StepHeader number="2" title="Confirm Payment" done={!!payment} />

            {/* Already paid */}
            {challan.status === 'PAID' && !payment && (
              <Alert type="success" message="This challan has already been paid. No action needed." />
            )}

            {/* Payment receipt */}
            {payment && (
              <>
                <Alert type="success" message="Payment successful! Your challan is now cleared." />
                <DetailRow label="Payment ID"    value={`#${payment.id}`}    mono />
                <DetailRow label="Challan ID"    value={`#${payment.challanId}`} mono />
                <DetailRow label="Amount Paid"   value={`₹${(payment.amount || 0).toLocaleString('en-IN')}`} />
                <DetailRow label="Status"        value={<StatusBadge status={payment.status || 'SUCCESS'} />} />
                <DetailRow
                  label="Payment Time"
                  value={payment.paymentTime
                    ? new Date(payment.paymentTime).toLocaleString('en-IN')
                    : '—'}
                />
              </>
            )}

            {/* Pay button — only when pending and not yet paid */}
            {challan.status !== 'PAID' && !payment && (
              <>
                <Alert type="error" message={payError} />
                <p style={{ fontSize: 14, color: '#374151', marginBottom: 18, lineHeight: 1.6 }}>
                  You are about to pay{' '}
                  <b style={{ color: '#ea580c', fontFamily: 'DM Mono, monospace' }}>
                    ₹{(challan.fineAmount || 0).toLocaleString('en-IN')}
                  </b>{' '}
                  for challan <b style={{ fontFamily: 'DM Mono, monospace' }}>#{challan.id}</b>
                  {' '}({challan.vehicleNumber}).
                </p>
                <button
                  onClick={handlePay}
                  disabled={payLoading}
                  style={{
                    background: '#16a34a', color: '#fff',
                    border: 'none', borderRadius: 9,
                    padding: '13px 32px',
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                    opacity: payLoading ? 0.7 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {payLoading
                    ? 'Processing…'
                    : `💳  Pay ₹${(challan.fineAmount || 0).toLocaleString('en-IN')} Now`}
                </button>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
