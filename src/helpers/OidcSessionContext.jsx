import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { parseJwt, isAccessTokenExpired } from './jwtParser'
import {
  buildOidcStartUrl,
  fetchOidcStatus,
  hasLmsPasswordFallback,
  isOidcSsoEnabled,
  LK_LOGOUT_RETURN_TO,
} from './oidcSession'
import {
  broadcastAuthLogout,
  clearLocalAuthArtifacts,
  startBffSessionWatch,
  subscribeAuthLogout,
} from './authEcosystemSync'

import Loader from '@/components/Loader'

import { clearAccessToken, getAccessToken, setAccessToken } from '@/helpers/accessTokenMemory'
import config from '@/config'

/** Silent SSO via IdP session (e.g. already logged into Tutor LMS). */
const redirectToSilentOidc = (pathname, search) => {
  const returnTo = `${pathname}${search || ''}`
  window.location.replace(buildOidcStartUrl(returnTo, 'none'))
}

const OidcSessionContext = createContext(null)

export const useOidcSession = () => useContext(OidcSessionContext)

async function tryRefreshLegacyAccessToken() {
  const base = (config.backendURL && config.backendURL[0]) ? config.backendURL[0].replace(/\/$/, '') : 'http://localhost:8080'
  const res = await fetch(`${base}/auth/refresh`, { method: 'GET', credentials: 'include' })
  if (!res.ok) {
    return null
  }
  const data = await res.json()
  if (!data?.accessToken) {
    return null
  }
  setAccessToken(data.accessToken)
  return data.accessToken
}

function sessionFromLegacyToken(token) {
  if (!token || isAccessTokenExpired(token)) {
    return null
  }
  const { Id, Role } = parseJwt(token)
  return {
    authenticated: true,
    role: Role,
    edx_user_id: Id,
    sub: Id,
    source: 'jwt',
  }
}

export const OidcSessionProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState(isOidcSsoEnabled() ? null : {})
  const [loading, setLoading] = useState(isOidcSsoEnabled())
  const sessionRef = useRef(session)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const handleRemoteLogout = () => {
    clearLocalAuthArtifacts()
    setSession({ authenticated: false })
    navigate(LK_LOGOUT_RETURN_TO, { replace: true })
  }

  useEffect(() => {
    if (!isOidcSsoEnabled()) {
      return undefined
    }

    const unsubscribeBroadcast = subscribeAuthLogout(handleRemoteLogout)
    const stopWatch = startBffSessionWatch({
      isAuthenticated: () => Boolean(sessionRef.current?.authenticated),
      onSessionLost: handleRemoteLogout,
    })

    return () => {
      unsubscribeBroadcast()
      stopWatch()
    }
  }, [navigate])

  useEffect(() => {
    if (!isOidcSsoEnabled()) {
      return undefined
    }

    let cancelled = false

    const load = async () => {
      try {
        const status = await fetchOidcStatus()
        if (cancelled) {
          return
        }
        if (status.authenticated) {
          setSession(status)
          setLoading(false)
          return
        }

        // Password login from Scratch (or LK forms) sets HttpOnly refresh_token on API host.
        // Accept that session before falling back to OIDC/mock.
        if (hasLmsPasswordFallback(status)) {
          let token = getAccessToken()
          if (!token || isAccessTokenExpired(token)) {
            token = await tryRefreshLegacyAccessToken()
            if (!token) {
              clearAccessToken()
            }
          }

          const legacy = sessionFromLegacyToken(token)
          if (legacy) {
            setSession(legacy)
            setLoading(false)
            return
          }

          // No password session — try silent IdP SSO, then login UI.
          redirectToSilentOidc(location.pathname, location.search)
          return
        }

        // Pure OIDC: silent first (LMS/Scratch already logged into Tutor).
        redirectToSilentOidc(location.pathname, location.search)
      } catch {
        if (!cancelled) {
          let token = getAccessToken()
          if (!token || isAccessTokenExpired(token)) {
            token = await tryRefreshLegacyAccessToken()
            if (!token) {
              clearAccessToken()
            }
          }
          const legacy = sessionFromLegacyToken(token)
          if (legacy) {
            setSession(legacy)
            setLoading(false)
            return
          }
          redirectToSilentOidc(location.pathname, location.search)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [location.pathname, location.search])

  if (loading) {
    return <Loader />
  }

  return (
    <OidcSessionContext.Provider value={session}>
      {children}
    </OidcSessionContext.Provider>
  )
}
