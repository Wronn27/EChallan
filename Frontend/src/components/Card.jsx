/**
 * Card.jsx
 * Simple white card container used throughout the app.
 * Accepts style overrides via the `style` prop.
 */
export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      border: '1px solid #e5e7eb',
      padding: '24px 26px',
      ...style,
    }}>
      {children}
    </div>
  )
}