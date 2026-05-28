/**
 * Dashboard.jsx
 *
 * Home screen — shown to all roles after login.
 * OFFICER / ADMIN: fetches summary stats from GET /challan/all
 * CITIZEN:         shows quick action cards only (no stats)
 */
import { useState, useEffect } from 'react'
import { api }        from '../services/api.js'
import Card           from '../components/Card.jsx'
import StatusBadge    from '../components/StatusBadge.jsx'

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: '1px solid #e5e7eb',
      padding: '20px 22px',
      borderLeft: `4px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 44, height: 44,
        background: accent + '18',
        borderRadius: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>{value}</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

// ─── Action card ─────────────────────────────────────────────────────────────
function ActionCard({ icon, title, desc, accent, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? accent + '08' : '#fff',
        border: `1.5px solid ${hov ? accent : '#e5e7eb'}`,
        borderRadius: 14, padding: '22px 24px',
        cursor: 'pointer', flex: '1 1 200px', maxWidth: 260,
        transition: 'all 0.15s',
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{desc}</div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard({ auth, onNavigate }) {
  const { token, email, role } = auth
  const [challans, setChallans] = useState([])
  const [loading,  setLoading]  = useState(false)

  // Only ADMIN and OFFICER can see stats via /challan/all
  useEffect(() => {
    if (role === 'ADMIN' || role === 'OFFICER') {
      setLoading(true)
      api.getAllChallans(token)
        .then(d => setChallans(Array.isArray(d) ? d : []))
        .catch(() => setChallans([]))
        .finally(() => setLoading(false))
    }
  }, [])

  const totalFines  = challans.reduce((s, c) => s + (c.fineAmount || 0), 0)
  const pendingCount = challans.filter(c => (c.status || 'PENDING') === 'PENDING').length
  const paidCount    = challans.filter(c => c.status === 'PAID').length
  const recent       = challans.slice(-5).reverse()

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 5 }}>
          Welcome back, <b style={{ color: '#374151' }}>{email}</b>
        </p>
      </div>

      {/* Stats — ADMIN / OFFICER only */}
      {(role === 'ADMIN' || role === 'OFFICER') && (
        loading
          ? <div style={{ color: '#9ca3af', padding: '20px 0' }}>Loading stats…</div>
          : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16, marginBottom: 30,
            }}>
              <StatCard icon="📋" label="Total Challans"   value={challans.length} accent="#3b4fd8" />
              <StatCard icon="⏳" label="Pending"          value={pendingCount}    accent="#ea580c" />
              <StatCard icon="✅" label="Paid"             value={paidCount}       accent="#16a34a" />
              <StatCard icon="₹" label="Total Fines (₹)"  value={`₹${totalFines.toLocaleString('en-IN')}`} accent="#7c3aed" />
            </div>
          )
      )}

      {/* Quick actions */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#6b7280', marginBottom: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Quick Actions
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        {role === 'OFFICER' && (
          <ActionCard icon="➕" title="Create Challan"   desc="Issue a new traffic violation challan"
            accent="#3b4fd8" onClick={() => onNavigate('create-challan')} />
        )}
        {(role === 'CITIZEN' || role === 'OFFICER') && (
          <ActionCard icon="🔍" title="Search Challans"  desc="Look up challans by vehicle number"
            accent="#0891b2" onClick={() => onNavigate('view-challans')} />
        )}
        {role === 'CITIZEN' && (
          <ActionCard icon="💳" title="Pay Fine"         desc="Pay a pending challan online"
            accent="#16a34a" onClick={() => onNavigate('payment')} />
        )}
        {role === 'ADMIN' && (
          <>
            <ActionCard icon="📋" title="All Challans"  desc="View every challan in the system"
              accent="#3b4fd8" onClick={() => onNavigate('view-challans')} />
            <ActionCard icon="📊" title="Analytics"     desc="Charts, stats and revenue overview"
              accent="#7c3aed" onClick={() => onNavigate('admin')} />
          </>
        )}
      </div>

      {/* Recent challans table — ADMIN / OFFICER */}
      {(role === 'ADMIN' || role === 'OFFICER') && recent.length > 0 && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Recent Challans</span>
            <span
              style={{ fontSize: 13, color: '#3b4fd8', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => onNavigate('view-challans')}
            >View all →</span>
          </div>
          <ChallanTable challans={recent} />
        </Card>
      )}
    </div>
  )
}

// ─── Reusable challan table (also used in AdminPanel) ─────────────────────────
export function ChallanTable({ challans }) {
  const cols = ['ID', 'Vehicle', 'Violation', 'Fine (₹)', 'Location', 'Status']
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            {cols.map(c => (
              <th key={c} style={{ padding: '9px 12px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {challans.map((c, i) => (
            <tr key={c.id || i}
              style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '10px 12px', color: '#d1d5db', fontFamily: 'DM Mono, monospace', fontSize: 12 }}>#{c.id}</td>
              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#3b4fd8', fontFamily: 'DM Mono, monospace' }}>{c.vehicleNumber}</td>
              <td style={{ padding: '10px 12px', color: '#374151' }}>{c.violationType}</td>
              <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>₹{(c.fineAmount || 0).toLocaleString('en-IN')}</td>
              <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 12 }}>{c.location || '—'}</td>
              <td style={{ padding: '10px 12px' }}><StatusBadge status={c.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
