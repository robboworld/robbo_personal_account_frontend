import {
  LMS_URL,
  LMS_OPEN_DIRECT,
  LK_SSO_WITH_LMS_ENABLED,
  OIDC_ISSUER,
  OIDC_AUTHORIZATION_ENDPOINT,
  OIDC_TOKEN_ENDPOINT,
  OIDC_JWKS_URI,
  OIDC_CLIENT_ID,
  OIDC_REDIRECT_URI,
  OIDC_LOGOUT_ENDPOINT,
  OIDC_POST_LOGOUT_REDIRECT_URI,
} from '@/constants'
import { buildOidcStartUrl } from '@/helpers/oidcSession'

const LK_LMS_IDENTITY_LINK_STORAGE_KEY = 'lk_lms_identity_link'

const logAuthEvent = (event, payload = {}) => {
  // eslint-disable-next-line no-console
  console.info(`[lms-sso] ${event}`, payload)
}

export const getOidcConfigStatus = () => {
  const required = {
    OIDC_ISSUER,
    OIDC_AUTHORIZATION_ENDPOINT,
    OIDC_TOKEN_ENDPOINT,
    OIDC_JWKS_URI,
    OIDC_CLIENT_ID,
    OIDC_REDIRECT_URI,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([name]) => name)

  return {
    ssoEnabled: LK_SSO_WITH_LMS_ENABLED,
    isComplete: missing.length === 0,
    missing,
  }
}

/** Редирект в LMS в текущей вкладке (сайдбар, Home, /mycourses). */
export const navigateToLmsSameTab = async () => {
  // Local stand: IdP is mock, not Tutor — BFF would bounce mock→/home.
  if (LMS_OPEN_DIRECT || !LK_SSO_WITH_LMS_ENABLED) {
    const status = getOidcConfigStatus()
    logAuthEvent('fallback_lms_direct_open_same_tab', { ...status, direct: LMS_OPEN_DIRECT })
    window.location.assign(LMS_URL)
    return
  }

  try {
    logAuthEvent('authorize_redirect_started', { mode: 'same_tab', flow: 'bff' })
    window.location.assign(buildOidcStartUrl(LMS_URL, 'none'))
  } catch (error) {
    logAuthEvent('fallback_lms_oidc_error_same_tab', { error: String(error?.message || error) })
    window.location.assign(LMS_URL)
  }
}

export const openLms = navigateToLmsSameTab

export const saveLmsIdentityLink = ({ sub, email = '', name = '' }) => {
  const payload = {
    external_sub: sub,
    email_snapshot: email,
    name_snapshot: name,
    last_login_at: new Date().toISOString(),
    status: 'active',
  }

  localStorage.setItem(LK_LMS_IDENTITY_LINK_STORAGE_KEY, JSON.stringify(payload))
  return payload
}

export const readLmsIdentityLink = () => {
  const raw = localStorage.getItem(LK_LMS_IDENTITY_LINK_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

export const clearLmsIdentityLink = () => {
  localStorage.removeItem(LK_LMS_IDENTITY_LINK_STORAGE_KEY)
}

export const reportSsoError = ({ reason, details = '' }) => {
  logAuthEvent('sso_error', { reason, details })
}

export const reportSsoSuccess = ({ sub }) => {
  logAuthEvent('sso_success', { sub })
}

export const buildPostLogoutUrl = () => {
  if (!OIDC_LOGOUT_ENDPOINT) {
    return ''
  }
  const logoutUrl = new URL(OIDC_LOGOUT_ENDPOINT)
  if (OIDC_POST_LOGOUT_REDIRECT_URI) {
    logoutUrl.searchParams.set('post_logout_redirect_uri', OIDC_POST_LOGOUT_REDIRECT_URI)
  }
  return logoutUrl.toString()
}
