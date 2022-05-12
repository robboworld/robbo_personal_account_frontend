import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';

import { PageLayout } from '@/layouts'
import Loader from '@/components/Loader'
import { Card, Heading } from './components'
import SideBar from '@/components/SideBar'

import { getIsAuth } from '@/reducers/login';

export default () => {
  const isAuth = useSelector(state => getIsAuth(state.login));
  if (!isAuth) {
    return <Redirect to={"/login"} />;
  }
  return (
    <PageLayout>
      <Card>
        <Heading id="welcome">Welcome to Robbo Student Account!</Heading>
        <SideBar></SideBar>
        {/* <Loader /> */}
      </Card>
    </PageLayout>
  )
}
