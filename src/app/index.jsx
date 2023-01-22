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
  PARENT,
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
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path={HOME_PAGE_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[STUDENT, TEACHER, PARENT, UNIT_ADMIN, SUPER_ADMIN]}>
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
            <ProtectedRoute allowedRoles={[STUDENT, TEACHER, PARENT, UNIT_ADMIN, SUPER_ADMIN]}>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path={COURSE_PAGE_ROUTE}
          element={
            <ProtectedRoute allowedRoles={[STUDENT, TEACHER, PARENT, UNIT_ADMIN, SUPER_ADMIN]}>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={CLIENTS_ROUTE}
          element={
            <ProtectedRoute
              allowedRoles={[SUPER_ADMIN]} >
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
            <ProtectedRoute allowedRoles={[STUDENT, TEACHER, PARENT, UNIT_ADMIN, SUPER_ADMIN]}>
              <ProfilePage />
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
              <RobboUnitsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROBBO_UNIT_STUDENT_GROUPS_PAGE}
          element={
            <ProtectedRoute allowedRoles={[SUPER_ADMIN, UNIT_ADMIN]}>
              <RobboGroups />
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
              <RobboGroups />
            </ProtectedRoute>
          }
        />
        <Route
          path='/*'
          element={<Navigate to={HOME_PAGE_ROUTE} replace />}
        />
      </Routes>
    </Suspense >
  )
}

export default App