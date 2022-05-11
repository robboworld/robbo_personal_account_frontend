import React from 'react'

import { PageLayout } from '@/layouts'

import Loader from '@/components/Loader'

import { Card, Heading } from './components'
import SideBar from '@/components/SideBar'

export default () => {
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
