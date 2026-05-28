import { useState } from 'react'
import LoginPage    from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import CreateChallan from './pages/CreateChallan.jsx'
import ViewChallans from './pages/ViewChallans.jsx'
import PaymentPage  from './pages/PaymentPage.jsx'
import AdminPanel   from './pages/AdminPanel.jsx'
import Sidebar      from './components/Sidebar.jsx'
import Navbar       from './components/Navbar.jsx'

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  // Auth state: { token, email, role } or null when logged out
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('ec_token')
      const user  = localStorage.getItem('ec_user')
      return token ? { token, ...JSON.parse(user) } : null
    } catch { return null }
  })

  // Which main page is visible
  const [page, setPage] = useState('dashboard')

  // Which auth screen (login vs register)
  const [authScreen, setAuthScreen] = useState('login')

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleLogin(token, email, role) {
    const user = { email, role }
    localStorage.setItem('ec_token', token)
    localStorage.setItem('ec_user', JSON.stringify(user))
    setAuth({ token, email, role })
    setPage('dashboard')
  }

  function handleLogout() {
    localStorage.removeItem('ec_token')
    localStorage.removeItem('ec_user')
    setAuth(null)
    setAuthScreen('login')
  }

  // ── not logged in: show auth screens ─────────────────────────────────────
  if (!auth) {
    return authScreen === 'login'
      ? <LoginPage    onLogin={handleLogin} onSwitch={() => setAuthScreen('register')} />
      : <RegisterPage onLogin={handleLogin} onSwitch={() => setAuthScreen('login')} />
  }

  // ── logged in: render layout + active page ────────────────────────────────
  function renderPage() {
    switch (page) {
      case 'dashboard':     return <Dashboard     auth={auth} onNavigate={setPage} />
      case 'create-challan':return <CreateChallan auth={auth} onNavigate={setPage} />
      case 'view-challans': return <ViewChallans  auth={auth} />
      case 'payment':       return <PaymentPage   auth={auth} />
      case 'admin':         return <AdminPanel    auth={auth} />
      default:              return <Dashboard     auth={auth} onNavigate={setPage} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} role={auth.role} onNavigate={setPage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar auth={auth} onLogout={handleLogout} />
        <main style={{
          flex: 1, overflow: 'auto',
          padding: '32px 36px',
          background: '#f0f2f8',
        }}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}