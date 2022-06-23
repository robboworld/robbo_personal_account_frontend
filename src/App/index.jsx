import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, PROJECT_PAGE_ROUTE, PROJECT_MVP_PAGE_ROUTE } from '@/constants'

import Loader from '@/components/Loader'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))
const ProjectPage = lazy(() => import('@/pages/ProjectPages'))
const ProjectMvpPage = lazy(() => import('@/pages/ProjectMvp'))


export default () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route
        exact
        path={HOME_PAGE_ROUTE}
        component={HomePage}
      />
      <Route
        exact
        path={LOGIN_PAGE_ROUTE}
        component={LoginPage}
      />
      <Route
        exact
        path={PROJECT_PAGE_ROUTE}
        component={ProjectPage}
      />
      <Route
        exact
        path={PROJECT_MVP_PAGE_ROUTE}
        component={ProjectMvpPage}
      />
      <Redirect from="/" to="/home" />
    </Switch>
  </Suspense>
)
