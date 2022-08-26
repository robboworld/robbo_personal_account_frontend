import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Heading } from './components'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'

import { getIsAuth } from '@/reducers/login'
import { useIsAuth } from '@/helpers'

export default () => {
  useIsAuth()

  const isAuth = useSelector(state => getIsAuth(state.login))

  if (!isAuth) {
    return <Redirect to='/login' />
  }

  return (
    <PageLayout>
      <Card>
        <Heading id='welcome'>Welcome to Robbo Student Account!</Heading>
        <SideBar />
      </Card>
    </PageLayout>
  )
}
