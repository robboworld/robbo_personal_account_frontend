import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  REGISTER_PAGE_ROUTE,
  PROJECT_PAGE_ROUTE,
  PUBLIC_PROJECTS_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_COURSES_ROUTE,
  OIDC_CALLBACK_ROUTE,
  COURSE_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  ROBBO_UNIT_STUDENT_GROUPS_PAGE,
  ROBBO_GROUPS_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  SUPER_ADMIN,
  STUDENT,
  UNIT_ADMIN,
  TEACHER,
  PARENT,
  FREE_LISTENER,
  SCRATCH_HUB_ROUTE,
  MY_LICENSES_ROUTE,
  ISSUE_LICENSE_ROUTE,
  DEVICE_LINK_ROUTE,
} from '@/constants'
import Loader from '@/components/Loader'
import AuthenticatedShell from '@/components/AuthenticatedLayout/AuthenticatedLayout'
import { ProtectedRoute, PublicAuthGate } from '@/helpers'

import HomePage from '@/pages/Home'
import ProfilePage from '@/pages/Profile'
import Logistration from '@/pages/Logistration'

const Landing = lazy(() => import('@/pages/Landing'))
const MyProjects = lazy(() => import('@/pages/MyProjects'))
const PublicProjects = lazy(() => import('@/pages/PublicProjects'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const LmsRedirect = lazy(() => import('@/pages/LmsRedirect'))
const OidcCallback = lazy(() => import('@/pages/OidcCallback'))
const CoursePage = lazy(() => import('@/pages/CoursePage'))
const TeachersPage = lazy(() => import('@/pages/Teachers'))
const ClientsPageContainer = lazy(() => import('@/containers/ClientsContainer'))
const UnitAdminsPage = lazy(() => import('@/pages/UnitAdmins'))
const RobboUnitsPage = lazy(() => import('@/pages/RobboUnits'))
const RobboGroups = lazy(() => import('@/pages/RobboGroups'))
const SendNotificationPage = lazy(() => import('@/pages/SendNotification'))
const ScratchHubPage = lazy(() => import('@/pages/ScratchHub'))
const MyLicensesPage = lazy(() => import('@/pages/Licensing/MyLicenses'))
const IssueLicensePage = lazy(() => import('@/pages/Licensing/IssueLicense'))
const DeviceLinkPage = lazy(() => import('@/pages/Licensing/DeviceLink'))

const STANDARD_ROLES = [STUDENT, TEACHER, PARENT, FREE_LISTENER, UNIT_ADMIN, SUPER_ADMIN]

const wrapProtected = (allowedRoles, element) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
)

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Landing />} />
    <Route path={OIDC_CALLBACK_ROUTE} element={<OidcCallback />} />
    <Route element={<PublicAuthGate />}>
      <Route path={LOGIN_PAGE_ROUTE} element={<Logistration />} />
      <Route path={REGISTER_PAGE_ROUTE} element={<Logistration />} />
    </Route>

    {/* Public + authenticated project page (guest uses landing header; owner uses LK shell). */}
    <Route path={PROJECT_PAGE_ROUTE} element={<ProjectPage />} />

    <Route element={<AuthenticatedShell />}>
      <Route
        path={HOME_PAGE_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <HomePage />)}
      />
      <Route path={MY_PROJECTS_ROUTE} element={wrapProtected([STUDENT], <MyProjects />)} />
      <Route path={PUBLIC_PROJECTS_ROUTE} element={wrapProtected(STANDARD_ROLES, <PublicProjects />)} />
      <Route path={SCRATCH_HUB_ROUTE} element={wrapProtected(STANDARD_ROLES, <ScratchHubPage />)} />
      <Route
        path={MY_COURSES_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <LmsRedirect />)}
      />
      <Route
        path={COURSE_PAGE_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <CoursePage />)}
      />
      <Route path={CLIENTS_ROUTE} element={wrapProtected([SUPER_ADMIN], <ClientsPageContainer />)} />
      <Route
        path={TEACHERS_PAGE_ROUTE}
        element={wrapProtected([SUPER_ADMIN, UNIT_ADMIN], <TeachersPage />)}
      />
      <Route
        path={PROFILE_PAGE_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <ProfilePage />)}
      />
      <Route path={UNIT_ADMINS_ROUTE} element={wrapProtected([SUPER_ADMIN], <UnitAdminsPage />)} />
      <Route
        path={ROBBO_UNITS_ROUTE}
        element={wrapProtected([SUPER_ADMIN, UNIT_ADMIN], <RobboUnitsPage />)}
      />
      <Route
        path={ROBBO_UNIT_STUDENT_GROUPS_PAGE}
        element={wrapProtected([SUPER_ADMIN, UNIT_ADMIN], <RobboGroups />)}
      />
      <Route
        path={ROBBO_GROUPS_ROUTE}
        element={wrapProtected([SUPER_ADMIN, UNIT_ADMIN], <RobboGroups />)}
      />
      <Route
        path={SEND_NOTIFICATION_ROUTE}
        element={wrapProtected([SUPER_ADMIN, UNIT_ADMIN], <SendNotificationPage />)}
      />
      <Route
        path={MY_LICENSES_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <MyLicensesPage />)}
      />
      <Route
        path={ISSUE_LICENSE_ROUTE}
        element={wrapProtected([SUPER_ADMIN], <IssueLicensePage />)}
      />
      <Route
        path={DEVICE_LINK_ROUTE}
        element={wrapProtected(STANDARD_ROLES, <DeviceLinkPage />)}
      />
    </Route>

    <Route path='/*' element={<Navigate to={HOME_PAGE_ROUTE} replace />} />
  </Routes>
)

const Application = () => (
  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100dvh', width: '100%' }}>
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  </div>
)

export default Application
