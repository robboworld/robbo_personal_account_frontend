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
import { parseJwt } from '@/helpers/jwtParser'
import {
  fetchOidcStatus,
  isHybridAuthEnabled,
  isOidcSsoEnabled,
} from '@/helpers/oidcSession'

const HOME_ROLES = [STUDENT, TEACHER, PARENT, FREE_LISTENER, UNIT_ADMIN, SUPER_ADMIN]

function isUsableLegacyToken(token) {
  try {
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
    const hybridAuth = isHybridAuthEnabled(oidcStatus)
    const showOidcLogin = isOidcSsoEnabled()

    if (oidcStatus.authenticated) {
      return { status: 'redirect' }
    }

    if (legacyToken && (oidcStatus.lms_password_fallback || !showOidcLogin)) {
      if (isUsableLegacyToken(legacyToken)) {
        return { status: 'redirect' }
      }
      localStorage.removeItem('token')
    } else if (legacyToken) {
      localStorage.removeItem('token')
    }

    return {
      status: 'ok',
      context: { oidcStatus, hybridAuth, showOidcLogin },
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
        hybridAuth: false,
        showOidcLogin: isOidcSsoEnabled(),
      },
    }
  }
}

let cachedGateResult = null

const PublicAuthGate = () => {
  const [gateState, setGateState] = useState(() => {
    if (cachedGateResult) {
      return cachedGateResult
    }
    return { status: 'loading' }
  })

  useEffect(() => {
    if (cachedGateResult) {
      return undefined
    }

    let cancelled = false

    resolveAuthGate().then(result => {
      if (!cancelled) {
        cachedGateResult = result
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
