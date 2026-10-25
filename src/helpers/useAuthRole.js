import { useMemo } from 'react'

import { parseJwt } from './jwtParser'
import { useOidcSession } from './OidcSessionContext'
import { isOidcSsoEnabled } from './oidcSession'
import { getAccessToken } from './accessTokenMemory'

const ANONYMOUS = Object.freeze({ id: '', role: null, email: '' })

/** Current user for UI decisions: the BFF session when SSO is on, else the in-memory legacy JWT.
 * Pages must use this (or useAuthRole) instead of parsing the JWT, which a BFF session never has. */
export function useCurrentUser() {
  const oidcSession = useOidcSession()

  return useMemo(() => {
    if (isOidcSsoEnabled() && oidcSession?.authenticated) {
      return {
        id: String(oidcSession.edx_user_id || oidcSession.sub || ''),
        role: oidcSession.role ?? null,
        email: oidcSession.email || '',
      }
    }

    const token = getAccessToken()
    if (!token) {
      return ANONYMOUS
    }

    try {
      const { Id, Role, Email } = parseJwt(token)
      return { id: Id ? String(Id) : '', role: Role ?? null, email: Email || '' }
    } catch {
      return ANONYMOUS
    }
  }, [oidcSession])
}

/** Role for UI: OIDC BFF session when SSO on, else legacy JWT Role. */
export function useAuthRole() {
  return useCurrentUser().role
}
