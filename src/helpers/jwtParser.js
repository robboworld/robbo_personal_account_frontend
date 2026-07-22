export function parseJwt(token) {
    const [, base64Url] = token.split('.')
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload)
}

/** Returns true when JWT `exp` is missing or already in the past. */
export function isAccessTokenExpired(token) {
    if (!token || token === 'null') {
        return true
    }
    try {
        const { exp } = parseJwt(token)
        if (typeof exp !== 'number') {
            return true
        }
        return exp <= Math.floor(Date.now() / 1000)
    } catch {
        return true
    }
}