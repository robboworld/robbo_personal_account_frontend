import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

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
  SUPER_ADMIN,
  STUDENT,
  UNIT_ADMIN,
  TEACHER,
} from '@/constants'
import Loader from '@/components/Loader'
import { ProtectedRoute } from '@/helpers'
import { getLoginState } from '@/reducers/login'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() => import('@/pages/Login'))
const MyProjects = lazy(() => import('@/pages/MyProjects'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const MyCourses = lazy(() => import('@/pages/MyCourses'))
const CoursePage = lazy(() => import('@/pages/CoursePage'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const PeekProfilePage = lazy(() => import('@/pages/PeekProfile'))
const TeachersPage = lazy(() => import('@/pages/Teachers'))
const ClientsPageContainer = lazy(() => import('@/pages/Clients/ClientsContainer'))
const ClientsPage = lazy(() => import('@/pages/Clients'))
const UnitAdminsPage = lazy(() => import('@/pages/UnitAdmins'))
const RobboUnitsPage = lazy(() => import('@/pages/RobboUnits'))
const RobboGroups = lazy(() => import('@/pages/RobboGroups'))
const Study = lazy(() => import('@/pages/Study'))

const App = () => {
  const { userRole } = useSelector(({ login }) => getLoginState(login))
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path={HOME_PAGE_ROUTE}
          element={
            <ProtectedRoute userRole={userRole}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={LOGIN_PAGE_ROUTE}
          element={<LoginPage />}
        />
        <Route
          path={MY_PROJECTS_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[STUDENT]}>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path={PROJECT_PAGE_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[STUDENT]}>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={MY_COURSES_ROUTE}
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path={COURSE_PAGE_ROUTE}
          element={
            <ProtectedRoute>
              <CoursePage userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path={CLIENTS_ROUTE}
          element={
            <ProtectedRoute
              allowedRoles={[SUPER_ADMIN]} userRole={userRole}>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={TEACHERS_PAGE_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <TeachersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PROFILE_PAGE_ROUTE}
          element={
            <ProtectedRoute>
              <ProfilePage userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path={PEEK_PROFILE_PAGE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <PeekProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={UNIT_ADMINS_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN]}>
              <UnitAdminsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROBBO_UNITS_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <RobboUnitsPage userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROBBO_UNIT_STUDENT_GROUPS_PAGE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <RobboGroups userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path={STUDY_PAGE_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[TEACHER]}>
              <Study />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROBBO_GROUPS_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <RobboGroups userRole={userRole} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/*'
          element={<Navigate to={HOME_PAGE_ROUTE} replace />}
        />
      </Routes>
    </Suspense>
  )
}

export default App