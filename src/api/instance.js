import * as axios from 'axios'

import config from '@/config'

const instance = axios.create()
const [backendURL] = config.backendURL
instance.defaults.baseURL = backendURL
instance.defaults.timeout = 1000
instance.defaults.headers = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': backendURL,
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
}

instance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    'token',
  )}`
  return config
})

instance.interceptors.response.use(
  config => {
    return config
  },
  async error => {
    const originalRequest = error.config

    if (error.response.status === 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await instance.get('auth/refresh', { withCredentials: true })
        localStorage.setItem('token', response.data.accessToken)
        return instance.request(originalRequest)
      } catch (e) {
        console.log('НЕ АВТОРИЗОВАН')
      }

    }
    throw error
  },
)

export default instance
