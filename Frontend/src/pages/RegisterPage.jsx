/**
 * RegisterPage.jsx
 *
 * Calls: POST /auth/register  { email, password }
 * Returns: AuthResponse { token }
 *
 * NOTE: Your current AuthRequest only has email + password.
 * The `role` field in the form is stored locally after JWT decode.
 * To persist role on registration, add `private String role;` to
 * AuthRequest.java and set it in AuthService.register().
 */
import { useState } from 'react'
import { api }      from '../services/api.js'
import { parseJwt } from '../utils/jwt.js'
import Alert        from '../components/Alert.jsx'

const ROLES = [
  { value: 'CITIZEN',  label: 'CITIZEN  — view & pay challans' },
  { value: 'OFFICER',  label: 'OFFICER  — issue challans' },
  { value: 'ADMIN',    label: 'ADMIN    — full access' },
]

export default function RegisterPage({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '', confirm: '', role: 'CITIZEN' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      // POST /auth/register
      const res = await api.register(form.email, form.password, form.role)
      const payload = parseJwt(res.token)
      const role = payload?.role || form.role
      onLogin(res.token, form.email, role)
    } catch (err) {
      setError(err.message || 'Registration failed.')
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
            <div style={s.brandSub}>Create your account</div>
          </div>
        </div>

        <h2 style={s.heading}>Register</h2>
        <Alert type="error" message={error} />

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="Min 6 characters"
              value={form.password} onChange={e => set('password', e.target.value)}
              required minLength={6} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm password</label>
            <input style={s.input} type="password" placeholder="Repeat password"
              value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Role</label>
            <select style={s.input} value={form.role} onChange={e => set('role', e.target.value)}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={s.switchText}>
          Already have an account?{' '}
          <span style={s.link} onClick={onSwitch}>Sign in</span>
        </p>
      </div>
    </div>
  )
}

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
  brand: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 },
  brandIcon: {
    width: 44, height: 44, background: '#eff2ff',
    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: '#3b4fd8',
  },
  brandTitle: { fontSize: 17, fontWeight: 700, color: '#111827' },
  brandSub:   { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  heading:    { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 20 },
  field:      { marginBottom: 16 },
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
    fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 6,
  },
  switchText: { textAlign: 'center', marginTop: 22, fontSize: 13, color: '#6b7280' },
  link: { color: '#3b4fd8', fontWeight: 700, cursor: 'pointer' },
}
