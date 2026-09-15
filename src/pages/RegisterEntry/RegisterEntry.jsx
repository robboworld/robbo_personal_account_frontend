import React, { useEffect, useState } from 'react'

import Loader from '@/components/Loader'
import {
  fetchOidcStatus,
  shouldUseOpenEdxAuthOnly,
} from '@/helpers/oidcSession'
import LmsRegisterRedirect from '@/pages/LmsRegisterRedirect'
import Logistration from '@/pages/Logistration'

const RegisterEntry = () => {
  const [mode, setMode] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetchOidcStatus()
      .then(status => {
        if (!cancelled) {
          setMode(shouldUseOpenEdxAuthOnly(status) ? 'lms' : 'local')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMode('local')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (mode === 'loading') {
    return <Loader />
  }
  if (mode === 'lms') {
    return <LmsRegisterRedirect />
  }
  return <Logistration />
}

export default RegisterEntry
