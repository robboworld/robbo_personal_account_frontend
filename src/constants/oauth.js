// Static process.env.* access — required so dotenv-webpack inlines values at build time.
// Dynamic getEnv(name) does NOT work in the browser bundle (always falls back to default).

export const LMS_URL = process.env.LMS_URL || 'https://online.robbo.ru'

export const LK_SSO_WITH_LMS_ENABLED = process.env.LK_SSO_WITH_LMS_ENABLED === 'true'

export const OIDC_ISSUER = process.env.OIDC_ISSUER || ''
export const OIDC_AUTHORIZATION_ENDPOINT = process.env.OIDC_AUTHORIZATION_ENDPOINT || ''
export const OIDC_TOKEN_ENDPOINT = process.env.OIDC_TOKEN_ENDPOINT || ''
export const OIDC_JWKS_URI = process.env.OIDC_JWKS_URI || ''
export const OIDC_USERINFO_ENDPOINT = process.env.OIDC_USERINFO_ENDPOINT || ''
export const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID || ''
export const OIDC_REDIRECT_URI = process.env.OIDC_REDIRECT_URI || ''
export const OIDC_SCOPES = process.env.OIDC_SCOPES || 'openid profile email'
export const OIDC_LOGOUT_ENDPOINT = process.env.OIDC_LOGOUT_ENDPOINT || ''
export const OIDC_POST_LOGOUT_REDIRECT_URI = process.env.OIDC_POST_LOGOUT_REDIRECT_URI || ''

export const LMS_OAUTH_AUTHORIZE_URL = OIDC_AUTHORIZATION_ENDPOINT
export const LMS_OAUTH_CLIENT_ID = OIDC_CLIENT_ID
export const LMS_OAUTH_REDIRECT_URI = OIDC_REDIRECT_URI
export const LMS_OAUTH_SCOPE = OIDC_SCOPES
