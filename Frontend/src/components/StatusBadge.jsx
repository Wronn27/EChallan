/**
 * StatusBadge.jsx
 * Renders a colour-coded badge for Challan / Payment status.
 * Challan.status values from your entity: PENDING, PAID
 */
const STATUS_STYLES = {
  PENDING: { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' },
  PAID:    { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  SUCCESS: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  FAILED:  { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING
  return (
    <span style={{
      ...s,
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.03em',
      display: 'inline-block',
    }}>
      {status || 'PENDING'}
    </span>
  )
}