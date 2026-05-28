/**
 * Sidebar.jsx
 * Role-aware left navigation.
 * Each role sees only the pages they're allowed to access
 * (mirrors SecurityConfig.java permissions).
 */

const NAV_ITEMS = {
  OFFICER: [
    { id: 'dashboard',      icon: '⊞', label: 'Dashboard' },
    { id: 'create-challan', icon: '＋', label: 'Create Challan' },
    { id: 'view-challans',  icon: '⊙', label: 'Search Challans' },
  ],
  CITIZEN: [
    { id: 'dashboard',     icon: '⊞', label: 'Dashboard' },
    { id: 'view-challans', icon: '⊙', label: 'My Challans' },
    { id: 'payment',       icon: '◈', label: 'Pay Fine' },
  ],
  ADMIN: [
    { id: 'dashboard',     icon: '⊞', label: 'Dashboard' },
    { id: 'view-challans', icon: '⊙', label: 'All Challans' },
    { id: 'admin',         icon: '◉', label: 'Analytics' },
  ],
}

const ROLE_ACCENT = {
  OFFICER: '#3b4fd8',
  CITIZEN: '#0e9e6e',
  ADMIN:   '#7c3aed',
}

export default function Sidebar({ page, role, onNavigate }) {
  const items  = NAV_ITEMS[role] || NAV_ITEMS.CITIZEN
  const accent = ROLE_ACCENT[role] || '#3b4fd8'

  return (
    <aside style={{
      width: 230, flexShrink: 0,
      background: '#111827',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #1f2937',
    }}>
      {/* ── Brand ── */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid #1f2937',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: accent,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff', fontWeight: 700,
          }}>⚖</div>
          <div>
            <div style={{ color: '#f9fafb', fontWeight: 700, fontSize: 15 }}>E-Challan</div>
            <div style={{ color: '#6b7280', fontSize: 11, marginTop: 1 }}>Traffic Portal</div>
          </div>
        </div>
      </div>

      {/* ── Role badge ── */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #1f2937' }}>
        <span style={{
          background: accent + '22',
          color: accent,
          border: `1px solid ${accent}44`,
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>{role}</span>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{
          fontSize: 10, color: '#4b5563',
          fontWeight: 600, letterSpacing: '0.08em',
          padding: '4px 10px 10px',
          textTransform: 'uppercase',
        }}>Navigation</div>

        {items.map(({ id, icon, label }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: '100%', display: 'flex',
                alignItems: 'center', gap: 10,
                padding: '10px 12px',
                borderRadius: 8, border: 'none',
                cursor: 'pointer', marginBottom: 2,
                background: active ? accent : 'transparent',
                color: active ? '#fff' : '#9ca3af',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#1f2937' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid #1f2937',
        fontSize: 10,
        color: '#374151',
      }}>v1.0 · E-Challan System</div>
    </aside>
  )
}