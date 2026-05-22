import config from '@/config'
import { LK_SSO_WITH_LMS_ENABLED } from '@/constants'

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
  const startUrl = new URL(`${apiBase()}/auth/oidc/start`)
  if (returnTo) {
    startUrl.searchParams.set('return_to', returnTo)
  }
  if (prompt) {
    startUrl.searchParams.set('prompt', prompt)
  }
  window.location.replace(startUrl.toString())
}

export const isOidcSsoEnabled = () => LK_SSO_WITH_LMS_ENABLED

export const hasLmsPasswordFallback = status => Boolean(status?.lms_password_fallback)

/** Hybrid: OAuth primary on login page; never auto-redirect (user chooses). */
export const isHybridAuthEnabled = status =>
  isOidcSsoEnabled() && (hasLmsPasswordFallback(status) || status?.auth_mode === 'oidc_bff')
