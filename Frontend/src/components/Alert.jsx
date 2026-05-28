/**
 * Alert.jsx
 * Usage:
 *   <Alert type="error"   message="Something went wrong" />
 *   <Alert type="success" message="Challan created!" />
 */
const STYLES = {
  error:   { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
  success: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  info:    { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
}

export default function Alert({ type = 'error', message }) {
  if (!message) return null
  const s = STYLES[type] || STYLES.error
  return (
    <div style={{
      ...s,
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 18,
      lineHeight: 1.5,
    }}>
      {message}
    </div>
  )
}