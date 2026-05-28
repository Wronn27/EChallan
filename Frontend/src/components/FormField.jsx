/**
 * FormField.jsx
 * Wraps a label and any input element.
 * Usage:
 *   <FormField label="Vehicle Number">
 *     <input ... />
 *   </FormField>
 */
export default function FormField({ label, children, style = {} }) {
  return (
    <div style={{ marginBottom: 18, ...style }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 6,
      }}>{label}</label>
      {children}
    </div>
  )
}

// Shared input style — import and spread onto your <input> elements
export const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 14,
  color: '#111827',
  background: '#fafafa',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}