/**
 * LoginPage.jsx
 *
 * Calls: POST /auth/login  { email, password }
 * Returns: AuthResponse { token }
 *
 * After login we decode the JWT to extract the `role` claim.
 * The role determines which sidebar items and pages are shown.
 */
import { useState } from 'react'
import { api }      from '../services/api.js'
import { parseJwt } from '../utils/jwt.js'
import Alert        from '../components/Alert.jsx'

export default function LoginPage({ onLogin, onSwitch }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 1. Call POST /auth/login
      const res = await api.login(email, password)

      // 2. Decode JWT to get role
      const payload = parseJwt(res.token)
      const role    = payload?.role || 'CITIZEN'

      // 3. Lift state up to App
      onLogin(res.token, email, role)
    } catch (err) {
      setError(
        err.message.includes('401') || err.message.includes('403')
          ? 'Invalid email or password.'
          : err.message || 'Login failed. Is the server running?'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Brand */}
        <div style={s.brand}>
          <div style={s.brandIcon}>⚖</div>
          <div>
            <div style={s.brandTitle}>E-Challan System</div>
            <div style={s.brandSub}>Traffic Violation Management</div>
          </div>
        </div>

        <h2 style={s.heading}>Sign in</h2>
        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              style={s.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={s.switchText}>
          No account?{' '}
          <span style={s.link} onClick={onSwitch}>Register here</span>
        </p>

        {/* Role hint box — helpful during development */}
        <div style={s.hint}>
          <div style={s.hintTitle}>Available roles</div>
          <div style={s.hintRow}><b>OFFICER</b> — issue challans</div>
          <div style={s.hintRow}><b>CITIZEN</b> — view &amp; pay challans</div>
          <div style={s.hintRow}><b>ADMIN</b>   — full access + analytics</div>
        </div>
      </div>
    </div>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
  },
  card: {
    background: '#fff', borderRadius: 18,
    padding: '40px 38px', width: 420,
    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 },
  brandIcon: {
    width: 44, height: 44,
    background: '#eff2ff', borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#3b4fd8',
  },
  brandTitle: { fontSize: 17, fontWeight: 700, color: '#111827' },
  brandSub:   { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  heading:    { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 20 },
  field:      { marginBottom: 18 },
  label:      { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: 9,
    fontSize: 14, background: '#f9fafb',
    boxSizing: 'border-box', color: '#111827',
  },
  btn: {
    width: '100%', padding: 13,
    background: '#3b4fd8', color: '#fff',
    border: 'none', borderRadius: 9,
    fontSize: 15, fontWeight: 700,
    cursor: 'pointer', marginTop: 4,
    letterSpacing: '0.02em',
  },
  switchText: { textAlign: 'center', marginTop: 22, fontSize: 13, color: '#6b7280' },
  link:       { color: '#3b4fd8', fontWeight: 700, cursor: 'pointer' },
  hint: {
    marginTop: 26,
    background: '#f8faff', border: '1px solid #e0e7ff',
    borderRadius: 10, padding: '12px 16px',
  },
  hintTitle: {
    fontSize: 10, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
  },
  hintRow: { fontSize: 12, color: '#4b5563', marginBottom: 4 },
}
