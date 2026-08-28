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
  if (returnTo) {
    startUrl.searchParams.set('return_to', returnTo)
  }
  if (prompt) {
    startUrl.searchParams.set('prompt', prompt)
  }
  if (kickOtherSessions) {
    startUrl.searchParams.set('kick_other_sessions', '1')
  }
  return startUrl.toString()
}

/** Clears BFF cookie on backend, then redirects to IdP logout or FE landing. */
export const buildOidcLogoutUrl = (returnTo = '/?logged_out=1') => {
  const logoutUrl = new URL(`${apiBase()}/auth/oidc/logout`)
  if (returnTo) {
    logoutUrl.searchParams.set('return_to', returnTo)
  }
  return logoutUrl.toString()
}

export const redirectToOidcLogout = (returnTo = '/?logged_out=1') => {
  window.location.assign(buildOidcLogoutUrl(returnTo))
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

export const resolveLoginReturnTo = search => {
  const params = new URLSearchParams(search || '')
  const returnTo = params.get('return_to')
  if (!returnTo) {
    return HOME_PAGE_ROUTE
  }

  try {
    return decodeURIComponent(returnTo)
  } catch {
    return returnTo
  }
}
