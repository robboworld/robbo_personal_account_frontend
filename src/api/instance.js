import axios from 'axios'

import config from '@/config'
import { redirectToOidcLogout, isOidcSsoEnabled } from '@/helpers/oidcSession'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/helpers/accessTokenMemory'

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
        const response = await instance.get('auth/refresh', { withCredentials: true })
        setAccessToken(response.data.accessToken)
        return instance.request(originalRequest)
      } catch (e) {
        console.log('НЕ АВТОРИЗОВАН')
      }

    }
    throw error
  },
)

export default instance
