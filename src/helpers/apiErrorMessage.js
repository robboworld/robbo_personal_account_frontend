import { formatMessageId } from './intl'

// One place that turns API failures (axios, Apollo, fetch) into text a user can act on.
// Raw backend strings are often Go errors with internal URLs; they never reach the screen.

const KNOWN_ERRORS = {
  'no access': 'errors.no_access',
  forbidden: 'errors.no_access',
  'not found': 'errors.not_found',
  'page not found': 'errors.not_found',
  'bad request': 'errors.bad_request',
  invalid_body: 'errors.bad_request',
  unauthorized: 'errors.unauthorized',
  'token not found': 'errors.unauthorized',
  session_not_found: 'errors.unauthorized',
  conflict: 'errors.conflict',
  'already in class': 'errors.already_in_class',
  session_limit_reached: 'errors.session_limit_reached',
  password_login_disabled: 'errors.password_login_disabled',
  lms_unavailable: 'errors.lms_unavailable',
  email_change_via_lms: 'errors.email_change_via_lms',
  too_many_requests: 'errors.too_many_requests',
}

const STATUS_ERRORS = {
  401: 'errors.unauthorized',
  403: 'errors.no_access',
  404: 'errors.not_found',
  409: 'errors.conflict',
  413: 'errors.too_large',
  429: 'errors.too_many_requests',
}

const CYRILLIC = /[а-яё]/i

/** Raw error text or code from an axios, Apollo or plain Error. */
export function apiErrorRaw (error) {
  const data = error?.response?.data
  if (data && typeof data === 'object') {
    if (data.code) return String(data.code)
    if (data.error) return String(data.error)
    if (data.message) return String(data.message)
  }
  if (typeof data === 'string' && data.trim()) return data
  const gql = error?.graphQLErrors?.[0] || error?.errors?.[0]
  if (gql?.message) return gql.message
  return error?.message ? String(error.message) : ''
}

function apiErrorStatus (error) {
  const status = Number(error?.response?.status || error?.networkError?.statusCode || error?.status)
  if (status) return status
  const gqlCode = Number(error?.graphQLErrors?.[0]?.extensions?.code)
  return Number.isFinite(gqlCode) ? gqlCode : 0
}

/** i18n id for an error, or null when the raw text is already a human message. */
export function apiErrorMessageId (error) {
  const raw = apiErrorRaw(error).trim()
  const key = raw.toLowerCase().replace(/^input:\s*/, '')
  if (KNOWN_ERRORS[key]) return KNOWN_ERRORS[key]
  if (key.startsWith('legacy postgres is disabled')) return 'errors.legacy_disabled'
  if (error?.code === 'ERR_NETWORK' || key === 'network error' || key === 'failed to fetch') {
    return 'errors.network'
  }
  if (error?.code === 'ECONNABORTED' || key.includes('timeout')) return 'errors.timeout'
  const status = apiErrorStatus(error)
  if (status >= 500) return 'errors.server'
  if (CYRILLIC.test(raw)) return null
  return STATUS_ERRORS[status] || 'errors.generic'
}

/** Text for a toast or an inline alert. */
export function apiErrorMessage (error, intl, fallbackId = 'errors.generic') {
  const id = apiErrorMessageId(error)
  if (id === null) return apiErrorRaw(error).trim()
  return intl.formatMessage({ id: id === 'errors.generic' ? fallbackId : id })
}

/** Same text outside React (sagas), where only the UI language is known. */
export function sagaErrorMessage (error, language) {
  return apiErrorMessage(error, { formatMessage: ({ id }) => formatMessageId(language, id) })
}
