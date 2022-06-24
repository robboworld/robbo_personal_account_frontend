import * as axios from "axios"

const instance = axios.create({
    baseURL: 'http://0.0.0.0:8000/',
    withCredentials: true,
    headers: {
        // 'Access-Control-Allow-Headers': 'x-requested-with, Content-Type, origin, authorization, accept, x-access-token',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'http://0.0.0.0:3030/',
    },
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

instance.interceptors.response.use(config => {
    return config
}, async error => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get(`http://0.0.0.0:8000/auth/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken)
            return instance.request(originalRequest)
        } catch (e) {
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error
})

export default instance