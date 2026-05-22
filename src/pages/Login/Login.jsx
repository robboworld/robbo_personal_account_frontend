import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import Loader from '@/components/Loader'
import { HOME_PAGE_ROUTE } from '@/constants'
import { fetchOidcStatus, isHybridAuthEnabled, isOidcSsoEnabled } from '@/helpers/oidcSession'
import { parseJwt } from '@/helpers/jwtParser'

export default () => {
  const [mode, setMode] = useState('loading')
  const [hybrid, setHybrid] = useState(false)

  useEffect(() => {
    const run = async () => {
      const legacyToken = localStorage.getItem('token')
      try {
        const status = await fetchOidcStatus()
        setHybrid(isHybridAuthEnabled(status))
        if (status.authenticated) {
          setMode('authed')
          return
        }
        if (legacyToken && (status.lms_password_fallback || !isOidcSsoEnabled())) {
          try {
            parseJwt(legacyToken)
            setMode('legacy-token')
            return
          } catch {
            localStorage.removeItem('token')
          }
        }
      } catch {
        if (legacyToken) {
          setMode('legacy-token')
          return
        }
      }
      setMode('form')
    }
    run()
  }, [])

  if (mode === 'loading') {
    return <Loader />
  }

  if (mode === 'authed' || mode === 'legacy-token') {
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  return <PageLayoutLogin showOidcLogin={isOidcSsoEnabled()} hybridAuth={hybrid} />
}
