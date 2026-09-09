import { useEffect } from 'react'

import { HOME_PAGE_ROUTE } from '@/constants'
import { buildOidcStartUrl } from '@/helpers/oidcSession'

/** SPA PKCE callback removed — IdP must redirect to backend /auth/oidc/callback. */
const OidcCallback = () => {
  useEffect(() => {
    window.location.replace(buildOidcStartUrl(HOME_PAGE_ROUTE, 'login'))
  }, [])
  return null
}

export default OidcCallback
