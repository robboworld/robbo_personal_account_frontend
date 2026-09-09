import * as axios from 'axios'

import config from '@/config'
import { redirectToOidcLogout, isOidcSsoEnabled } from '@/helpers/oidcSession'
import { buildInactiveLoginURL } from '@/helpers/inactiveLogin'
import { clearAccessToken, getAccessToken, setAccessToken } from '@/helpers/accessTokenMemory'

const instance = axios.create()
const [backendURL] = config.backendURL
instance.defaults.baseURL = backendURL
instance.defaults.timeout = 30000
instance.defaults.headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': backendURL,
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}
instance.defaults.withCredentials = true

instance.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (config.headers) {
    delete config.headers.Authorization
  }
  if (!config.headers['X-Requested-With']) {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
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
