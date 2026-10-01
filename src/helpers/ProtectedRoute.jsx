import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getAccessToken } from './accessTokenMemory'
import { parseJwt, isAccessTokenExpired } from './jwtParser'
import { useOidcSession } from './OidcSessionContext'
import { isOidcSsoEnabled } from './oidcSession'

import { tryRefreshAccessToken } from '@/api/projectPage'
import Loader from '@/components/Loader'
import { LOGIN_PAGE_ROUTE, HOME_PAGE_ROUTE } from '@/constants'

const usableToken = token => (token && !isAccessTokenExpired(token) ? token : null)

export const ProtectedRoute = ({
  allowedRoles = [],
  redirectPath = LOGIN_PAGE_ROUTE,
  children,
}) => {
  const location = useLocation()
  const oidcSession = useOidcSession()
  const ssoAuthenticated = isOidcSsoEnabled() && oidcSession?.authenticated
  // Legacy JWT lives in memory only (accessTokenMemory): after a reload it is gone, so try the
  // refresh cookie once before sending the user to /login (keeps deep links working).
  const token = usableToken(getAccessToken())
  const needsRefresh = !ssoAuthenticated && !token
  const [refreshDone, setRefreshDone] = useState(false)

  useEffect(() => {
    if (!needsRefresh || refreshDone) {
      return undefined
    }
    let cancelled = false
    tryRefreshAccessToken().finally(() => {
      if (!cancelled) {
        setRefreshDone(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [needsRefresh, refreshDone])

  if (ssoAuthenticated) {
    const role = oidcSession?.role ?? 0
    if (!allowedRoles.includes(role)) {
      if (location.pathname === HOME_PAGE_ROUTE) {
        return <Navigate to={redirectPath} replace />
      }
      return <Navigate to={HOME_PAGE_ROUTE} replace />
    }

    const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          userRole: role,
          userId: oidcSession?.edx_user_id || oidcSession?.sub || '',
        })
      }
      return child
    })

    return childrenWithProps || null
  }

  if (!token) {
    if (!refreshDone) {
      return <Loader />
    }
    return <Navigate to={LOGIN_PAGE_ROUTE} replace />
  }

  const { Role } = parseJwt(token)
  if (!allowedRoles.includes(Role)) {
    if (location.pathname === HOME_PAGE_ROUTE) {
      return <Navigate to={LOGIN_PAGE_ROUTE} replace />
    }
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  const childrenWithProps = React.Children.map(children, child => {
    const { Id, Role: legacyRole } = parseJwt(token)
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { userRole: legacyRole, userId: Id })
    }
    return child
  })

  return childrenWithProps || null
}
