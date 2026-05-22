import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { parseJwt } from './jwtParser'
import {
  fetchOidcStatus,
  hasLmsPasswordFallback,
  isOidcSsoEnabled,
  redirectToOidcStart,
} from './oidcSession'

import Loader from '@/components/Loader'

import { LOGIN_PAGE_ROUTE } from '@/constants'

const OidcSessionContext = createContext(null)

export const useOidcSession = () => useContext(OidcSessionContext)

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

        const token = localStorage.getItem('token')
        if (hasLmsPasswordFallback(status) && token) {
          const { Id, Role } = parseJwt(token)
          setSession({
            authenticated: true,
            role: Role,
            edx_user_id: Id,
            sub: Id,
            source: 'jwt',
          })
          setLoading(false)
          return
        }

        if (hasLmsPasswordFallback(status)) {
          const returnTo = encodeURIComponent(`${location.pathname}${location.search}`)
          navigate(`${LOGIN_PAGE_ROUTE}?return_to=${returnTo}`, { replace: true })
          return
        }

        redirectToOidcStart(`${location.pathname}${location.search}`)
      } catch {
        if (!cancelled) {
          const token = localStorage.getItem('token')
          if (token) {
            const { Id, Role } = parseJwt(token)
            setSession({
              authenticated: true,
              role: Role,
              edx_user_id: Id,
              sub: Id,
              source: 'jwt',
            })
            setLoading(false)
            return
          }
          navigate(LOGIN_PAGE_ROUTE, { replace: true })
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
