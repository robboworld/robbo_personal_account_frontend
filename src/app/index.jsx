import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  PROJECT_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_COURSES_ROUTE,
  COURSE_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  PEEK_PROFILE_PAGE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  ROBBO_UNIT_STUDENT_GROUPS_PAGE,
  STUDY_PAGE_ROUTE,
  ROBBO_GROUPS_ROUTE,
} from '@/constants'
import Loader from '@/components/Loader'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))
const MyProjects = lazy(() => import('@/pages/MyProjects'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const MyCourses = lazy(() => import('@/pages/MyCourses'))
const CoursePage = lazy(() => import('@/pages/CoursePage'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const PeekProfilePage = lazy(() => import('@/pages/PeekProfile'))
const TeachersPage = lazy(() => import('@/pages/Teachers'))
const ClientsPage = lazy(() => import('@/pages/Clients'))
const UnitAdminsPage = lazy(() => import('@/pages/UnitAdmins'))
const RobboUnitsPage = lazy(() => import('@/pages/RobboUnits'))
const RobboGroups = lazy(() => import('@/pages/RobboGroups'))
const Study = lazy(() => import('@/pages/Study'))

export default () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route
        path={HOME_PAGE_ROUTE}
        element={<HomePage />}
      />
      <Route
        path={LOGIN_PAGE_ROUTE}
        element={<LoginPage />}
      />
      <Route
        path={MY_PROJECTS_ROUTE}
        element={<MyProjects />}
      />
      <Route
        path={PROJECT_PAGE_ROUTE}
        element={<ProjectPage />}
      />
      <Route
        path={MY_COURSES_ROUTE}
        element={<MyCourses />}
      />
      <Route
        path={COURSE_PAGE_ROUTE}
        element={<CoursePage />}
      />
      <Route
        path={CLIENTS_ROUTE}
        element={<ClientsPage />}
      />
      <Route
        path={TEACHERS_PAGE_ROUTE}
        element={<TeachersPage />}
      />
      <Route
        path={PROFILE_PAGE_ROUTE}
        element={<ProfilePage />}
      />
      <Route
        path={PEEK_PROFILE_PAGE}
        element={<PeekProfilePage />}
      />
      <Route
        path={UNIT_ADMINS_ROUTE}
        element={<UnitAdminsPage />}
      />
      <Route
        path={ROBBO_UNITS_ROUTE}
        element={<RobboUnitsPage />}
      />
      <Route
        path={ROBBO_UNIT_STUDENT_GROUPS_PAGE}
        element={<RobboGroups />}
      />
      <Route
        path={STUDY_PAGE_ROUTE}
        element={<Study />}
      />
      <Route
        path={ROBBO_GROUPS_ROUTE}
        element={<RobboGroups />}
      />
      <Route
        path='/'
        element={<Navigate to={HOME_PAGE_ROUTE} replace />}
      />
    </Routes>
  </Suspense>
)