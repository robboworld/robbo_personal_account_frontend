import React, { useEffect } from 'react'

import { navigateToLmsSameTab } from '@/helpers'

const LmsRedirect = () => {
  useEffect(() => {
    navigateToLmsSameTab()
  }, [])

  return null
}

export default LmsRedirect
