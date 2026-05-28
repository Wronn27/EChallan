/**
 * Navbar.jsx
 * Top header bar — shows logged-in user email, role, and logout button.
 */

const ROLE_COLORS = {
  OFFICER: { bg: '#eff2ff', text: '#3b4fd8', border: '#c7d0f8' },
  CITIZEN: { bg: '#ecfdf5', text: '#0e9e6e', border: '#a7f3d0' },
  ADMIN:   { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
}

export default function Navbar({ auth, onLogout }) {
  const { email, role } = auth
  const initials = email?.[0]?.toUpperCase() || 'U'
  const colors   = ROLE_COLORS[role] || ROLE_COLORS.OFFICER

  return (
    <header style={{
      height: 60, flexShrink: 0,
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Left: breadcrumb hint */}
      <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
        Traffic Violation Management System
      </div>

      {/* Right: user info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Role pill */}
        <span style={{
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}>{role}</span>

        {/* Email */}
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{email}</span>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: colors.bg,
          color: colors.text,
          border: `2px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 14,
          flexShrink: 0,
        }}>{initials}</div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: '1.5px solid #e5e7eb',
            borderRadius: 8,
            padding: '6px 16px',
            cursor: 'pointer',
            fontSize: 13,
            color: '#6b7280',
            fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280' }}
        >Logout</button>
      </div>
    </header>
  )
}