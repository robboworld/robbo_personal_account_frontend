import React, { useEffect } from 'react'

import Loader from '@/components/Loader'
import { lmsRegisterUrl } from '@/helpers/oidcSession'

const LmsRegisterRedirect = () => {
  useEffect(() => {
    window.location.replace(lmsRegisterUrl())
  }, [])

  return <Loader />
}

export default LmsRegisterRedirect
