import React from 'react'
import { Navigate } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'

import { useUserIdentity } from '@/helpers'
import { LOGIN_PAGE_ROUTE } from '@/constants'

export default () => {
  const { isAuth, loginLoading } = useUserIdentity()

  if (!isAuth && !loginLoading) {
    return <Navigate to={LOGIN_PAGE_ROUTE} />
  }

  return <PageLayout />
}
