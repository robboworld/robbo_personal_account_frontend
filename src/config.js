function trimTrailingSlash(url) {
  return (url || '').trim().replace(/\/$/, '')
}

function resolveBackendOrigin() {
  if (typeof process !== 'undefined' && process.env && process.env.BACKEND_URL) {
    return trimTrailingSlash(process.env.BACKEND_URL)
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const port = (process.env && process.env.BACKEND_PORT) || '8080'
    return `http://${window.location.hostname}:${port}`
  }
  return 'http://localhost:8080'
}

function resolveFrontendOrigin() {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin
  }
  if (typeof process !== 'undefined' && process.env && process.env.FRONTEND_URL) {
    return trimTrailingSlash(process.env.FRONTEND_URL)
  }
  return 'http://localhost:3030'
}

const backendOrigin = resolveBackendOrigin()
const frontendOrigin = resolveFrontendOrigin()

export default {
  scratchURL: 'http://scratch.ru/',
  backendURL: [`${backendOrigin}/`],
  frontendURL: [`${frontendOrigin}/`],
  graphQLURL: [`${backendOrigin}/query`],
}
