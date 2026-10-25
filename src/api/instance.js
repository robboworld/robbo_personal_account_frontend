import axios from 'axios'

import config from '@/config'
import { buildOidcStartUrl, redirectToOidcLogout, isOidcSsoEnabled } from '@/helpers/oidcSession'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'
import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'
import { refreshAccessToken } from '@/api/authRefresh'

// Pages that work without a session: a 401 there is not a reason to leave.
const PUBLIC_PATHS = [/^\/$/, /^\/explore/, /^\/projects\/(?!public)/, /^\/join/, /^\/login/, /^\/register/, /^\/auth\//]

let sessionRedirectStarted = false

/** Session is gone on an LK page: send the user to sign in and back here, once. */
export function redirectToSignInAfterExpiry () {
  const { pathname, search } = window.location
  if (sessionRedirectStarted || PUBLIC_PATHS.some(re => re.test(pathname))) {
    return
  }
  sessionRedirectStarted = true
  const back = `${pathname}${search || ''}`
  if (isOidcSsoEnabled()) {
    window.location.assign(buildOidcStartUrl(back, 'login'))
    return
  }
  window.location.assign(`/login?session_expired=1&return_to=${encodeURIComponent(back)}`)
}

const instance = axios.create()
const [backendURL] = config.backendURL
instance.defaults.baseURL = backendURL
instance.defaults.timeout = 30000
// Keep axios' per-method header defaults; Access-Control-* are response headers and were
// being sent as request headers. X-Requested-With satisfies the backend cookie CSRF check.
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.common['Content-Type'] = 'application/json'
instance.defaults.withCredentials = true

instance.interceptors.request.use(config => {
  // axios 1.x: config.headers is an AxiosHeaders instance (case-insensitive set/has/delete).
  const token = getAccessToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  } else {
    config.headers.delete('Authorization')
  }
  if (!config.headers.has('X-Requested-With')) {
    config.headers.set('X-Requested-With', 'XMLHttpRequest')
  }
  return config
})

instance.interceptors.response.use(
  config => {
    return config
  },
  async error => {
    const originalRequest = error.config
    const code = error?.response?.data?.code
    if (code === 'SESSION_NOT_FOUND' || code === 'USER_INACTIVE') {
      clearAccessToken()
      if (code === 'USER_INACTIVE') {
        const ban = error?.response?.data?.ban || null
        const loginURL = buildInactiveLoginURL(ban)
        if (isOidcSsoEnabled()) {
          redirectToOidcLogout(loginURL)
        } else {
          window.location.assign(loginURL)
        }
      }
      throw error
    }

    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        await refreshAccessToken()
      } catch (_) {
        redirectToSignInAfterExpiry()
        throw error
      }
      return instance.request(originalRequest)

    }
    throw error
  },
)

export default instance
