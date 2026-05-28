/**
 * API service — maps exactly to your Spring Boot controllers.
 *
 * Because vite.config.js proxies /auth, /challan, /payment → localhost:8080
 * we use relative paths (no http://localhost:8080 prefix needed in dev).
 *
 * Controller → method mapping:
 *
 * AuthController   POST /auth/register   → api.register(email, password)
 * AuthController   POST /auth/login      → api.login(email, password)
 *
 * ChallanController POST /challan/create  → api.createChallan(data, token)   OFFICER
 * ChallanController GET  /challan/all     → api.getAllChallans(token)         ADMIN
 * ChallanController GET  /challan/vehicle/{n} → api.getChallansByVehicle(n, token)
 * ChallanController GET  /challan/id/{id} → api.getChallanById(id, token)
 *
 * PaymentController POST /payment/pay    → api.payChallan(challanId, amount, token) CITIZEN
 */

// Helper: build headers with optional Bearer token
function headers(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Helper: handle response — parse JSON or text, throw on error
async function handle(res) {
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || `HTTP ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('json') ? res.json() : res.text()
}

export const api = {

  // ── /auth ──────────────────────────────────────────────────────────────────

  /**
   * POST /auth/register
   * Body : AuthRequest { email, password }
   * Returns : AuthResponse { token }
   */
  register(email, password, role) {
  return fetch('/auth/register', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, role }),
  }).then(handle)
},

  /**
   * POST /auth/login
   * Body : AuthRequest { email, password }
   * Returns : AuthResponse { token }
   */
  login(email, password) {
    return fetch('/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    }).then(handle)
  },

  // ── /challan ───────────────────────────────────────────────────────────────

  /**
   * POST /challan/create   (OFFICER only — 403 for others)
   * Body : ChallanRequest { vehicleNumber, violationType, fineAmount, location }
   * Returns : Challan entity
   */
  createChallan({ vehicleNumber, violationType, fineAmount, location }, token) {
    return fetch('/challan/create', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ vehicleNumber, violationType, fineAmount, location }),
    }).then(handle)
  },

  /**
   * GET /challan/all   (ADMIN only — 403 for others)
   * Returns : List<Challan>
   */
  getAllChallans(token) {
    return fetch('/challan/all', { headers: headers(token) }).then(handle)
  },

  /**
   * GET /challan/vehicle/{vehicleNumber}   (CITIZEN, OFFICER, ADMIN)
   * Returns : List<Challan>
   */
  getChallansByVehicle(vehicleNumber, token) {
    return fetch(`/challan/vehicle/${encodeURIComponent(vehicleNumber)}`, {
      headers: headers(token),
    }).then(handle)
  },

  /**
   * GET /challan/id/{challanId}   (any authenticated user)
   * Returns : Challan entity
   */
  getChallanById(id, token) {
    return fetch(`/challan/id/${id}`, { headers: headers(token) }).then(handle)
  },

  // ── /payment ───────────────────────────────────────────────────────────────

  /**
   * POST /payment/pay   (CITIZEN only — 403 for others)
   * Body : PaymentRequest { challanId, amount }
   * Returns : Payment entity
   */
  payChallan(challanId, amount, token) {
    return fetch('/payment/pay', {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ challanId, amount }),
    }).then(handle)
  },
}