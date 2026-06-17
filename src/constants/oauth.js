const getEnv = (name, fallback = '') => {
  if (typeof process !== 'undefined' && process.env && process.env[name] !== undefined) {
    return process.env[name]
  }

  return fallback
}

export const LMS_URL = getEnv('LMS_URL', 'https://online.robbo.ru')

// Soft rollout switch for SSO in LK.
export const LK_SSO_WITH_LMS_ENABLED = getEnv('LK_SSO_WITH_LMS_ENABLED', 'false') === 'true'

// OIDC endpoints/config (Open edX as IdP).
export const OIDC_ISSUER = getEnv('OIDC_ISSUER', '')
export const OIDC_AUTHORIZATION_ENDPOINT = getEnv('OIDC_AUTHORIZATION_ENDPOINT', '')
export const OIDC_TOKEN_ENDPOINT = getEnv('OIDC_TOKEN_ENDPOINT', '')
export const OIDC_JWKS_URI = getEnv('OIDC_JWKS_URI', '')
export const OIDC_USERINFO_ENDPOINT = getEnv('OIDC_USERINFO_ENDPOINT', '')
export const OIDC_CLIENT_ID = getEnv('OIDC_CLIENT_ID', '')
export const OIDC_REDIRECT_URI = getEnv('OIDC_REDIRECT_URI', '')
export const OIDC_SCOPES = getEnv('OIDC_SCOPES', 'openid profile email')
export const OIDC_LOGOUT_ENDPOINT = getEnv('OIDC_LOGOUT_ENDPOINT', '')
export const OIDC_POST_LOGOUT_REDIRECT_URI = getEnv('OIDC_POST_LOGOUT_REDIRECT_URI', '')

// Legacy aliases for backward compatibility in old imports.
export const LMS_OAUTH_AUTHORIZE_URL = OIDC_AUTHORIZATION_ENDPOINT
export const LMS_OAUTH_CLIENT_ID = OIDC_CLIENT_ID
export const LMS_OAUTH_REDIRECT_URI = OIDC_REDIRECT_URI
export const LMS_OAUTH_SCOPE = OIDC_SCOPES
