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

export const redirectToOidcStart = (returnTo = '', prompt = 'login') => {
  window.location.replace(buildOidcStartUrl(returnTo, prompt))
}

export const buildOidcStartUrl = (returnTo = '', prompt = 'login') => {
  const startUrl = new URL(`${apiBase()}/auth/oidc/start`)
  if (returnTo) {
    startUrl.searchParams.set('return_to', returnTo)
  }
  if (prompt) {
    startUrl.searchParams.set('prompt', prompt)
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
export const passwordLoginOidc = async (usernameOrEmail, password, returnTo = HOME_PAGE_ROUTE) => {
  const response = await fetch(`${apiBase()}/auth/oidc/password-login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
      return_to: returnTo,
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
 * Pure local password forms (SSO off). When SSO is on, /login shows AuthLayout
 * with an OIDC button; hybrid mode also shows SignInForm under the button.
 * AUTH_LMS_PASSWORD_FALLBACK enables POST /auth/sign-in for Scratch dropdown
 * and hybrid LK login — it does not hide the OIDC button.
 */
export const shouldShowLocalAuthForms = () => !isOidcSsoEnabled()

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
