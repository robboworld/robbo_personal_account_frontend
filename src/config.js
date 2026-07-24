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

function resolveScratchOrigin(path, fromEnv) {
  const envUrl = (fromEnv || '').trim()
  if (envUrl) {
    return envUrl
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const port = (process.env && process.env.SCRATCH_PLAYER_PORT) || '5001'
    return `http://${window.location.hostname}:${port}${path}`
  }
  return `http://127.0.0.1:5001${path}`
}

const backendOrigin = resolveBackendOrigin()
const frontendOrigin = resolveFrontendOrigin()

export default {
  // Static process.env.* so dotenv-webpack / DefinePlugin can inline local .env values.
  scratchURL: resolveScratchOrigin('/', process.env.SCRATCH_EDITOR_URL),
  scratchPlayerURL: resolveScratchOrigin('/player.html', process.env.SCRATCH_PLAYER_URL),
  backendURL: [`${backendOrigin}/`],
  frontendURL: [`${frontendOrigin}/`],
  graphQLURL: [`${backendOrigin}/query`],
}
