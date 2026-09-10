import config from '@/config'
import { HOME_PAGE_ROUTE, LK_SSO_WITH_LMS_ENABLED, LMS_URL } from '@/constants'

const apiBase = () => {
  const url = config.backendURL && config.backendURL[0]
  return url ? url.replace(/\/$/, '') : 'http://localhost:8080'
}

export const fetchOidcStatus = async () => {
  const response = await fetch(`${apiBase()}/auth/oidc/status`, {
    credentials: 'include',
  })
  if (!response.ok) {
    return { authenticated: false }
  }
  return response.json()
}

export const redirectToOidcStart = (returnTo = '', prompt = 'login', kickOtherSessions = false) => {
  window.location.replace(buildOidcStartUrl(returnTo, prompt, kickOtherSessions))
}

export const buildOidcStartUrl = (returnTo = '', prompt = 'login', kickOtherSessions = false) => {
  const startUrl = new URL(`${apiBase()}/auth/oidc/start`)
  const safeReturnTo = allowlistedReturnTo(returnTo)
  if (safeReturnTo) {
    startUrl.searchParams.set('return_to', safeReturnTo)
  }
  if (prompt) {
    startUrl.searchParams.set('prompt', prompt)
  }
  if (kickOtherSessions) {
    startUrl.searchParams.set('kick_other_sessions', '1')
  }
  return startUrl.toString()
}

/** Product-scoped BFF logout (path-only; Open edX HTML-escapes '&' in redirect_url). */
export const oidcLogoutPath = product => {
  const name = product === 'rs' || product === 'lms' ? product : 'lk'
  return `${apiBase()}/auth/oidc/logout/${name}`
}

/** Relative path on LK FE after logout (landing). */
export const LK_LOGOUT_RETURN_TO = '/?logged_out=1'

/** Clears BFF cookie, then LMS session, then product landing. */
export const buildOidcLogoutUrl = (returnTo = LK_LOGOUT_RETURN_TO, { skipIdp = false } = {}) => {
  if (!skipIdp) {
    return oidcLogoutPath('lk')
  }
  const logoutUrl = new URL(`${apiBase()}/auth/oidc/logout`)
  const safeReturnTo = allowlistedReturnTo(returnTo)
  if (safeReturnTo) {
    logoutUrl.searchParams.set('return_to', safeReturnTo)
  }
  logoutUrl.searchParams.set('skip_idp', '1')
  return logoutUrl.toString()
}

export const redirectToOidcLogout = (returnTo = LK_LOGOUT_RETURN_TO, options) => {
  window.location.assign(buildOidcLogoutUrl(returnTo, options))
}

export const isOidcSsoEnabled = () => LK_SSO_WITH_LMS_ENABLED

/**
 * Verify LMS credentials and issue BFF session cookie without IdP redirect.
 * Keeps the user on /login UI until a same-origin navigate to return_to.
 * @returns {Promise<{ok: true, email?: string, return_to?: string}|{ok: false, error: string}>}
 */
export const passwordLoginOidc = async (
  usernameOrEmail,
  password,
  returnTo = HOME_PAGE_ROUTE,
  { kickOtherSessions = false } = {},
) => {
  const response = await fetch(`${apiBase()}/auth/oidc/password-login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
      return_to: returnTo,
      kickOtherSessions: Boolean(kickOtherSessions),
    }),
  })
  let data = {}
  try {
    data = await response.json()
  } catch {
    data = {}
  }
  if (response.ok && data?.ok) {
    return {
      ok: true,
      email: data.email || usernameOrEmail,
      return_to: data.return_to || returnTo,
    }
  }
  return {
    ok: false,
    error: data?.error || (response.status === 401 ? 'invalid_credentials' : 'generic'),
  }
}

/** @deprecated use passwordLoginOidc — kept for callers that only need a check */
export const verifyOidcLoginCredentials = async (usernameOrEmail, password) => {
  const result = await passwordLoginOidc(usernameOrEmail, password, HOME_PAGE_ROUTE)
  if (result.ok) {
    return { ok: true, email: result.email }
  }
  return { ok: false, error: result.error }
}

export const hasLmsPasswordFallback = status => Boolean(status?.lms_password_fallback)

/**
 * Local Ant Design login/register when SSO is off, or password fallback is on.
 * Pure OIDC (SSO on, fallback off) sends /login to mock/IdP via /auth/oidc/start.
 */
export const shouldShowLocalAuthForms = status =>
  !isOidcSsoEnabled() || hasLmsPasswordFallback(status)

/** Scratch (and other API clients) may use password while LK UI uses OIDC. */
export const isHybridAuthEnabled = status =>
  isOidcSsoEnabled() && hasLmsPasswordFallback(status)

export const redirectToLmsRegister = () => {
  window.location.replace(`${LMS_URL}/register`)
}

const allowlistedReturnTo = raw => {
  const value = String(raw || '').trim()
  if (!value || value.startsWith('//') || value.includes('\n') || value.includes('\r')) {
    return HOME_PAGE_ROUTE
  }
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return HOME_PAGE_ROUTE
    }
    const allowed = new Set()
    const add = origin => {
      try {
        allowed.add(new URL(origin).origin)
      } catch {
        // ignore
      }
    }
    add(window.location.origin)
    add(LMS_URL)
    add('http://localhost:8601')
    add('http://127.0.0.1:8601')
    add('http://localhost:5001')
    add('http://127.0.0.1:5001')
    add('https://scratch.ru')
    if (allowed.has(parsed.origin)) {
      return value
    }
  } catch {
    return HOME_PAGE_ROUTE
  }
  return HOME_PAGE_ROUTE
}

export const resolveLoginReturnTo = search => {
  const params = new URLSearchParams(search || '')
  const returnTo = params.get('return_to')
  if (!returnTo) {
    return HOME_PAGE_ROUTE
  }

  try {
    return allowlistedReturnTo(decodeURIComponent(returnTo))
  } catch {
    return allowlistedReturnTo(returnTo)
  }
}
