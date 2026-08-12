import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { parseJwt, isAccessTokenExpired } from './jwtParser'
import {
  fetchOidcStatus,
  hasLmsPasswordFallback,
  isOidcSsoEnabled,
} from './oidcSession'

import Loader from '@/components/Loader'

import { LOGIN_PAGE_ROUTE } from '@/constants'
import config from '@/config'

const navigateToLogin = (navigate, pathname, search) => {
  const returnTo = `${pathname}${search || ''}`
  navigate(
    `${LOGIN_PAGE_ROUTE}?return_to=${encodeURIComponent(returnTo)}`,
    { replace: true },
  )
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
  localStorage.setItem('token', data.accessToken)
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
          let token = localStorage.getItem('token')
          if (!token || isAccessTokenExpired(token)) {
            token = await tryRefreshLegacyAccessToken()
            if (!token) {
              localStorage.removeItem('token')
            }
          }

          const legacy = sessionFromLegacyToken(token)
          if (legacy) {
            setSession(legacy)
            setLoading(false)
            return
          }

          // No password session — send to LK login (silent SSO / OIDC button).
          navigateToLogin(navigate, location.pathname, location.search)
          return
        }

        navigateToLogin(navigate, location.pathname, location.search)
      } catch {
        if (!cancelled) {
          let token = localStorage.getItem('token')
          if (!token || isAccessTokenExpired(token)) {
            token = await tryRefreshLegacyAccessToken()
            if (!token) {
              localStorage.removeItem('token')
            }
          }
          const legacy = sessionFromLegacyToken(token)
          if (legacy) {
            setSession(legacy)
            setLoading(false)
            return
          }
          navigateToLogin(navigate, location.pathname, location.search)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [location.pathname, location.search, navigate])

  if (loading) {
    return <Loader />
  }

  return (
    <OidcSessionContext.Provider value={session}>
      {children}
    </OidcSessionContext.Provider>
  )
}
