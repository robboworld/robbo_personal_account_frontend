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

export const isOidcSsoEnabled = () => LK_SSO_WITH_LMS_ENABLED

export const hasLmsPasswordFallback = status => Boolean(status?.lms_password_fallback)

/** Local Ant Design login/register when SSO is off or password fallback is enabled. */
export const shouldShowLocalAuthForms = status =>
  !isOidcSsoEnabled() || hasLmsPasswordFallback(status)

/** @deprecated Use shouldShowLocalAuthForms — kept for tests/imports. */
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
