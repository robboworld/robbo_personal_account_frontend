import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from 'react-router-dom'

import { PageLayout, Card } from '@/layouts'
import Loader from '@/components/Loader'
import { Heading } from './components'
import SideBar from '@/components/SideBar'

import { checkAuthRequest } from '@/actions'
import { getIsAuth } from '@/reducers/login'

export default () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuthRequest(localStorage.getItem('token')))
    }
  }, [])

  const isAuth = useSelector(state => getIsAuth(state.login))

  if (!isAuth) {
    return <Redirect to="/login" />
  }

  return (
    <PageLayout>
      <Card>
        <Heading id="welcome">Welcome to Robbo Student Account!</Heading>
        <SideBar />
        {/* <Loader /> */}
      </Card>
    </PageLayout>
  )
}
