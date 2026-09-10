import { clearAccessToken } from '@/helpers/accessTokenMemory'
import { clearLmsIdentityLink } from '@/helpers/lmsSso'
import { fetchOidcStatus } from '@/helpers/oidcSession'

const AUTH_LOGOUT_BROADCAST_KEY = 'robbo_auth_logout_at'
const DEFAULT_POLL_MS = 5000

/** Same-origin tabs (e.g. several :3030 tabs) — instant logout signal. */
export function broadcastAuthLogout () {
  try {
    localStorage.setItem(AUTH_LOGOUT_BROADCAST_KEY, String(Date.now()))
  } catch {
    // private mode
  }
}

export function subscribeAuthLogout (callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const onStorage = event => {
    if (event.key === AUTH_LOGOUT_BROADCAST_KEY) {
      callback()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

export function clearLocalAuthArtifacts () {
  clearAccessToken()
  try {
    localStorage.removeItem('token')
  } catch {
    // ignore
  }
  clearLmsIdentityLink()
}

/**
 * Poll BFF /auth/oidc/status so logout in another product (shared cookie on :8080)
 * clears UI in this tab without manual refresh.
 */
export function startBffSessionWatch ({
  isAuthenticated,
  onSessionLost,
  pollIntervalMs = DEFAULT_POLL_MS,
}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  let lastAuthenticated = Boolean(isAuthenticated())
  let stopped = false

  const runCheck = async () => {
    if (stopped) {
      return
    }
    try {
      const status = await fetchOidcStatus()
      const authenticated = Boolean(status?.authenticated)
      if (lastAuthenticated && !authenticated) {
        onSessionLost(status)
      }
      lastAuthenticated = authenticated
    } catch {
      // network blip — keep previous state
    }
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') {
      runCheck()
    }
  }

  document.addEventListener('visibilitychange', onVisibility)
  const timer = window.setInterval(runCheck, pollIntervalMs)
  runCheck()

  return () => {
    stopped = true
    document.removeEventListener('visibilitychange', onVisibility)
    window.clearInterval(timer)
  }
}
