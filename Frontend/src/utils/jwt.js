/**
 * Decode a JWT payload without verifying signature.
 * Used client-side only to read the `role` claim so we can
 * show the right sidebar / pages for OFFICER / CITIZEN / ADMIN.
 *
 * Your JwtUtil.java must add:
 *   .claim("role", user.getRole())
 * when building the token.
 */
export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}