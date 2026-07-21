import { useMemo } from 'react'

import { parseJwt } from './jwtParser'
import { useOidcSession } from './OidcSessionContext'
import { isOidcSsoEnabled } from './oidcSession'

/** Role for UI: OIDC BFF session when SSO on, else legacy JWT Role from localStorage. */
export function useAuthRole() {
  const oidcSession = useOidcSession()

  return useMemo(() => {
    if (isOidcSsoEnabled() && oidcSession?.authenticated) {
      return oidcSession?.role ?? null
    }

    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }

    try {
      return parseJwt(token).Role ?? null
    } catch {
      return null
    }
  }, [oidcSession])
}
