import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import Loader from '@/components/Loader'
import {
  FREE_LISTENER,
  HOME_PAGE_ROUTE,
  PARENT,
  STUDENT,
  SUPER_ADMIN,
  TEACHER,
  UNIT_ADMIN,
} from '@/constants'
import { parseJwt, isAccessTokenExpired } from '@/helpers/jwtParser'
import {
  fetchOidcStatus,
  isOidcSsoEnabled,
  shouldShowLocalAuthForms,
} from '@/helpers/oidcSession'

const HOME_ROLES = [STUDENT, TEACHER, PARENT, FREE_LISTENER, UNIT_ADMIN, SUPER_ADMIN]

function isUsableLegacyToken(token) {
  try {
    if (isAccessTokenExpired(token)) {
      return false
    }
    const { Role } = parseJwt(token)
    return HOME_ROLES.includes(Role)
  } catch {
    return false
  }
}

async function resolveAuthGate() {
  const legacyToken = localStorage.getItem('token')

  try {
    const oidcStatus = await fetchOidcStatus()
    const showLocalAuthForms = shouldShowLocalAuthForms(oidcStatus)
    const ssoEnabled = isOidcSsoEnabled()

    if (oidcStatus.authenticated) {
      return { status: 'redirect' }
    }

    if (legacyToken && (oidcStatus.lms_password_fallback || !ssoEnabled)) {
      if (isUsableLegacyToken(legacyToken)) {
        return { status: 'redirect' }
      }
      localStorage.removeItem('token')
    } else if (legacyToken) {
      localStorage.removeItem('token')
    }

    return {
      status: 'ok',
      context: { oidcStatus, showLocalAuthForms },
    }
  } catch {
    if (legacyToken && isUsableLegacyToken(legacyToken)) {
      return { status: 'redirect' }
    }
    if (legacyToken) {
      localStorage.removeItem('token')
    }

    return {
      status: 'ok',
      context: {
        oidcStatus: { authenticated: false },
        showLocalAuthForms: !isOidcSsoEnabled(),
      },
    }
  }
}

const PublicAuthGate = () => {
  const [gateState, setGateState] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    resolveAuthGate().then(result => {
      if (!cancelled) {
        setGateState(result)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (gateState.status === 'loading') {
    return <Loader />
  }

  if (gateState.status === 'redirect') {
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  return <Outlet context={gateState.context} />
}

export default PublicAuthGate
