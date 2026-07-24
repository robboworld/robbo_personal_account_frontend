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

/** Clears BFF cookie on backend, then redirects to IdP logout or FE /login. */
export const buildOidcLogoutUrl = (returnTo = '/login') => {
  const logoutUrl = new URL(`${apiBase()}/auth/oidc/logout`)
  if (returnTo) {
    logoutUrl.searchParams.set('return_to', returnTo)
  }
  return logoutUrl.toString()
}

export const redirectToOidcLogout = (returnTo = '/login') => {
  window.location.assign(buildOidcLogoutUrl(returnTo))
}

export const isOidcSsoEnabled = () => LK_SSO_WITH_LMS_ENABLED

export const hasLmsPasswordFallback = status => Boolean(status?.lms_password_fallback)

/**
 * Local Ant Design login/register only when SSO is off.
 * When LK_SSO_WITH_LMS_ENABLED: /login always goes to OIDC (mock/prod IdP).
 * AUTH_LMS_PASSWORD_FALLBACK enables POST /auth/sign-in for Scratch dropdown —
 * it must NOT switch the LK login page to password forms.
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
