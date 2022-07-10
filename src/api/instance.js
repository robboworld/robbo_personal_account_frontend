import * as axios from "axios"
import config from "@/config"


const instance = axios.create({
  baseURL: config.backendURL[0],
  withCredentials: true,
  headers: {
    // 'Access-Control-Allow-Headers': 'x-requested-with, Content-Type, origin, authorization, accept, x-access-token',
    // 'Access-Control-Allow-Credentials': true,
    // 'Access-Control-Allow-Origin': config.frontendURL[0],
    // 'Access-Control-Allow-Methods': '*',
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Origin': 'http://0.0.0.0:8000/',
  },

})

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

    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get(config.backendURL[0] + `auth/refresh`, { withCredentials: true })
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
