import React, { memo } from 'react'
import { Redirect } from 'react-router-dom'

import PageLayout from '@/components/PageLayout'

import { useUserIdentity } from '@/helpers'
import { LOGIN_PAGE_ROUTE } from '@/constants'

export default memo(() => {
  const { isAuth, loginLoading } = useUserIdentity()

  if (!isAuth && !loginLoading) {
    return <Redirect to={LOGIN_PAGE_ROUTE} />
  }

  return (
    <PageLayout />
  )
})
