import React from 'react'

import { isOidcSsoEnabled } from './oidcSession'
import { OidcSessionProvider } from './OidcSessionContext'

/**
 * When LK_SSO_WITH_LMS_ENABLED, ensures BFF session once per subtree via OidcSessionProvider.
 */
export const RequireAuth = ({ children }) => {
  if (!isOidcSsoEnabled()) {
    return children
  }

  return <OidcSessionProvider>{children}</OidcSessionProvider>
}
