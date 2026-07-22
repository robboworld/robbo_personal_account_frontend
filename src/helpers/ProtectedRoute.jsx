import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { parseJwt, isAccessTokenExpired } from './jwtParser'
import { useOidcSession } from './OidcSessionContext'
import { isOidcSsoEnabled } from './oidcSession'

import { LOGIN_PAGE_ROUTE, HOME_PAGE_ROUTE } from '@/constants'

export const ProtectedRoute = ({
  allowedRoles = [],
  redirectPath = LOGIN_PAGE_ROUTE,
  children,
}) => {
  const location = useLocation()
  const oidcSession = useOidcSession()

  if (isOidcSsoEnabled() && oidcSession?.authenticated) {
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

  const token = localStorage.getItem('token')
  if (!token || isAccessTokenExpired(token)) {
    if (token) {
      localStorage.removeItem('token')
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
