import config from '@/config'
import { setAccessToken } from '@/helpers/accessTokenMemory'

/** Backend origin without a trailing slash. */
export const apiBase = () => {
  const url = config.backendURL && config.backendURL[0]
  return url ? url.replace(/\/$/, '') : 'http://localhost:8080'
}

let inFlight = null

async function requestRefresh() {
  // Plain fetch, not the axios instance: its 401 interceptor would refresh the refresh.
  const res = await fetch(`${apiBase()}/auth/refresh`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Session expired')
  }
  const data = await res.json()
  if (!data?.accessToken) {
    throw new Error('Session expired')
  }
  setAccessToken(data.accessToken)
  return data.accessToken
}

/**
 * Exchanges the refresh_token cookie for a new access token. Concurrent callers (axios,
 * Apollo, fetch helpers hitting 401 at once) share one request: every refresh reissues the
 * cookie, so a burst of parallel calls would race on it.
 */
export const refreshAccessToken = () => {
  if (!inFlight) {
    inFlight = requestRefresh().finally(() => {
      inFlight = null
    })
  }
  return inFlight
}

/** Soft refresh: the new access token, or null when the session cannot be refreshed. */
export const tryRefreshAccessToken = () => refreshAccessToken().catch(() => null)
