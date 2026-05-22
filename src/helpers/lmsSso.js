import {
  LMS_URL,
  LK_SSO_WITH_LMS_ENABLED,
  OIDC_ISSUER,
  OIDC_AUTHORIZATION_ENDPOINT,
  OIDC_TOKEN_ENDPOINT,
  OIDC_JWKS_URI,
  OIDC_USERINFO_ENDPOINT,
  OIDC_CLIENT_ID,
  OIDC_REDIRECT_URI,
  OIDC_SCOPES,
  OIDC_LOGOUT_ENDPOINT,
  OIDC_POST_LOGOUT_REDIRECT_URI,
} from '@/constants'

const SSO_STATE_STORAGE_KEY = 'lk_lms_oauth_state'
const SSO_NONCE_STORAGE_KEY = 'lk_lms_oauth_nonce'
const SSO_CODE_VERIFIER_STORAGE_KEY = 'lk_lms_oauth_code_verifier'
const SSO_CORRELATION_ID_STORAGE_KEY = 'lk_lms_oauth_correlation_id'
const LK_LMS_IDENTITY_LINK_STORAGE_KEY = 'lk_lms_identity_link'

const toBase64Url = bytes =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

const randomString = (length = 32) => {
  const bytes = new Uint8Array(length)
  window.crypto.getRandomValues(bytes)
  return toBase64Url(bytes)
}

const toUtf8Bytes = value => new TextEncoder().encode(value)

const createCodeChallenge = async codeVerifier => {
  const digest = await window.crypto.subtle.digest('SHA-256', toUtf8Bytes(codeVerifier))
  return toBase64Url(new Uint8Array(digest))
}

const isOAuthConfigured = () =>
  Boolean(
    OIDC_ISSUER &&
    OIDC_AUTHORIZATION_ENDPOINT &&
    OIDC_TOKEN_ENDPOINT &&
    OIDC_JWKS_URI &&
    OIDC_CLIENT_ID &&
    OIDC_REDIRECT_URI,
  )

const logAuthEvent = (event, payload = {}) => {
  const correlationId = sessionStorage.getItem(SSO_CORRELATION_ID_STORAGE_KEY) || randomString(12)
  sessionStorage.setItem(SSO_CORRELATION_ID_STORAGE_KEY, correlationId)

  // eslint-disable-next-line no-console
  console.info(`[lms-sso] ${event}`, { correlationId, ...payload })
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

const buildAuthorizeUrl = async () => {
  const state = randomString(16)
  const nonce = randomString(16)
  const codeVerifier = randomString(64)
  const codeChallenge = await createCodeChallenge(codeVerifier)

  sessionStorage.setItem(SSO_STATE_STORAGE_KEY, state)
  sessionStorage.setItem(SSO_NONCE_STORAGE_KEY, nonce)
  sessionStorage.setItem(SSO_CODE_VERIFIER_STORAGE_KEY, codeVerifier)

  const authorizeUrl = new URL(OIDC_AUTHORIZATION_ENDPOINT)
  authorizeUrl.searchParams.set('client_id', OIDC_CLIENT_ID)
  authorizeUrl.searchParams.set('redirect_uri', OIDC_REDIRECT_URI)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('scope', OIDC_SCOPES)
  authorizeUrl.searchParams.set('state', state)
  authorizeUrl.searchParams.set('nonce', nonce)
  authorizeUrl.searchParams.set('code_challenge', codeChallenge)
  authorizeUrl.searchParams.set('code_challenge_method', 'S256')
  authorizeUrl.searchParams.set('prompt', 'none')

  return authorizeUrl.toString()
}

const openLmsDirect = () => {
  window.open(LMS_URL, '_blank', 'noopener,noreferrer')
}

export const openLms = async () => {
  if (!LK_SSO_WITH_LMS_ENABLED || !isOAuthConfigured()) {
    const status = getOidcConfigStatus()
    logAuthEvent('fallback_lms_direct_open_new_tab', status)
    openLmsDirect()
    return
  }

  try {
    logAuthEvent('authorize_redirect_started', { mode: 'new_tab' })
    const url = await buildAuthorizeUrl()
    const popup = window.open(url, '_blank', 'noopener,noreferrer')
    if (!popup) {
      logAuthEvent('fallback_lms_popup_blocked')
      openLmsDirect()
    }
  } catch (error) {
    logAuthEvent('fallback_lms_oidc_error', { error: String(error?.message || error) })
    openLmsDirect()
  }
}

/** Редирект в LMS в текущей вкладке (маршрут /mycourses и прямые ссылки). */
export const navigateToLmsSameTab = async () => {
  if (!LK_SSO_WITH_LMS_ENABLED || !isOAuthConfigured()) {
    const status = getOidcConfigStatus()
    logAuthEvent('fallback_lms_direct_open_same_tab', status)
    window.location.replace(LMS_URL)
    return
  }

  try {
    logAuthEvent('authorize_redirect_started', { mode: 'same_tab' })
    const url = await buildAuthorizeUrl()
    window.location.assign(url)
  } catch (error) {
    logAuthEvent('fallback_lms_oidc_error_same_tab', { error: String(error?.message || error) })
    window.location.replace(LMS_URL)
  }
}

export const readPkceFromSession = () => ({
  state: sessionStorage.getItem(SSO_STATE_STORAGE_KEY),
  nonce: sessionStorage.getItem(SSO_NONCE_STORAGE_KEY),
  codeVerifier: sessionStorage.getItem(SSO_CODE_VERIFIER_STORAGE_KEY),
})

export const clearPkceFromSession = () => {
  sessionStorage.removeItem(SSO_STATE_STORAGE_KEY)
  sessionStorage.removeItem(SSO_NONCE_STORAGE_KEY)
  sessionStorage.removeItem(SSO_CODE_VERIFIER_STORAGE_KEY)
}

export const parseJwtWithoutVerification = token => {
  const [, base64Url] = token.split('.')
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''))
  return JSON.parse(jsonPayload)
}

export const validateIdTokenClaims = ({ idToken, expectedNonce }) => {
  const payload = parseJwtWithoutVerification(idToken)
  const now = Math.floor(Date.now() / 1000)
  const reasons = []

  if (payload.iss !== OIDC_ISSUER) reasons.push('invalid_issuer')
  if (payload.aud !== OIDC_CLIENT_ID && !(Array.isArray(payload.aud) && payload.aud.includes(OIDC_CLIENT_ID))) reasons.push('invalid_audience')
  if (!payload.exp || payload.exp <= now) reasons.push('token_expired')
  if (expectedNonce && payload.nonce !== expectedNonce) reasons.push('invalid_nonce')
  if (!payload.sub) reasons.push('missing_sub')

  return {
    valid: reasons.length === 0,
    reasons,
    payload,
  }
}

export const exchangeCodeForTokens = async ({ code, codeVerifier }) => {
  const params = new URLSearchParams()
  params.set('grant_type', 'authorization_code')
  params.set('code', code)
  params.set('client_id', OIDC_CLIENT_ID)
  params.set('redirect_uri', OIDC_REDIRECT_URI)
  params.set('code_verifier', codeVerifier)

  const response = await fetch(OIDC_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`token_exchange_failed:${response.status}:${text}`)
  }

  return response.json()
}

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

export const reportSsoError = ({ reason, details = '' }) => {
  logAuthEvent('sso_error', { reason, details })
}

export const reportSsoSuccess = ({ sub }) => {
  logAuthEvent('sso_success', { sub })
}

export const fetchUserInfo = async accessToken => {
  if (!OIDC_USERINFO_ENDPOINT) {
    return null
  }

  const response = await fetch(OIDC_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}
