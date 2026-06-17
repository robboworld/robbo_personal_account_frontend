
import { parseJwt } from './jwtParser'
import { fetchOidcStatus, isOidcSsoEnabled } from './oidcSession'

import {
  FREE_LISTENER,
  PARENT,
  STUDENT,
  SUPER_ADMIN,
  TEACHER,
  UNIT_ADMIN,
} from '@/constants'

const HOME_ROLES = [STUDENT, TEACHER, PARENT, FREE_LISTENER, UNIT_ADMIN, SUPER_ADMIN]

function isUsableLegacyToken(token) {
  try {
    const { Role } = parseJwt(token)
    return HOME_ROLES.includes(Role)
  } catch {
    return false
  }
}

/**
 * Same rules as Login for OIDC + legacy JWT, plus a home-role check.
 * Stale or OIDC-only leftover tokens are removed so public pages stay reachable.
 */
export async function shouldRedirectAuthenticatedUserToHome() {
  const legacyToken = localStorage.getItem('token')

  try {
    const status = await fetchOidcStatus()
    if (status.authenticated) {
      return true
    }

    if (legacyToken && (status.lms_password_fallback || !isOidcSsoEnabled())) {
      if (isUsableLegacyToken(legacyToken)) {
        return true
      }
      localStorage.removeItem('token')
      return false
    }

    if (legacyToken) {
      localStorage.removeItem('token')
    }
    return false
  } catch {
    if (legacyToken && isUsableLegacyToken(legacyToken)) {
      return true
    }
    if (legacyToken) {
      localStorage.removeItem('token')
    }
    return false
  }
}
