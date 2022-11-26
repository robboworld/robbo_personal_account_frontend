import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import {
  HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, PROJECT_PAGE_ROUTE,
  MY_PROJECTS_ROUTE, MY_COURSES_ROUTE, COURSE_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE, PEEK_PROFILE_PAGE, TEACHERS_PAGE_ROUTE, CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE, ROBBO_UNITS_ROUTE, ROBBO_UNIT_STUDENT_GROUPS_PAGE,
  STUDY_PAGE_ROUTE,
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
        path={MY_PROJECTS_ROUTE}
        component={MyProjects}
      />
      <Route
        exact
        path={PROJECT_PAGE_ROUTE}
        component={ProjectPage}
      />
      <Route
        exact
        path={MY_COURSES_ROUTE}
        component={MyCourses}
      />
      <Route
        exact
        path={COURSE_PAGE_ROUTE}
        component={CoursePage}
      />
      <Route
        exact
        path={CLIENTS_ROUTE}
        component={ClientsPage}
      />

      <Route
        exact
        path={TEACHERS_PAGE_ROUTE}
        component={TeachersPage}
      />
      <Route
        exact
        path={PROFILE_PAGE_ROUTE}
        component={ProfilePage}
      />
      <Route
        exact
        path={PEEK_PROFILE_PAGE}
        component={PeekProfilePage}
      />
      <Route
        exact
        path={UNIT_ADMINS_ROUTE}
        component={UnitAdminsPage}
      />
      <Route
        exact
        path={ROBBO_UNITS_ROUTE}
        component={RobboUnitsPage}
      />
      <Route
        exact
        path={ROBBO_UNIT_STUDENT_GROUPS_PAGE}
        component={RobboGroups}
      />
      <Route
        exact
        path={STUDY_PAGE_ROUTE}
        component={Study}
      />
      <Redirect from='/' to={HOME_PAGE_ROUTE} />
    </Switch>
  </Suspense>


  // const ref = useRef(null)
  // const refLeft = useRef(null)
  // const refTop = useRef(null)
  // const refRight = useRef(null)
  // const refBottom = useRef(null)

  // useEffect(() => {
  //   const resizeableEle = ref.current
  //   const styles = window.getComputedStyle(resizeableEle)
  //   let width = parseInt(styles.width, 10)
  //   let height = parseInt(styles.height, 10)
  //   let x = 0
  //   let y = 0
  //   resizeableEle.style.top = "50px"
  //   resizeableEle.style.left = "50px"

  //   // Right resize
  //   const onMouseMoveRightResize = event => {
  //     const dx = event.clientX - x
  //     x = event.clientX
  //     width = width + dx
  //     resizeableEle.style.width = `${width}px`
  //   }

  //   const onMouseUpRightResize = event => {
  //     document.removeEventListener("mousemove", onMouseMoveRightResize)
  //   }

  //   const onMouseDownRightResize = event => {
  //     x = event.clientX
  //     resizeableEle.style.left = styles.left
  //     resizeableEle.style.right = null
  //     document.addEventListener("mousemove", onMouseMoveRightResize)
  //     document.addEventListener("mouseup", onMouseUpRightResize)
  //   }

  //   // Top resize
  //   const onMouseMoveTopResize = event => {
  //     const dy = event.clientY - y
  //     height = height - dy
  //     y = event.clientY
  //     resizeableEle.style.height = `${height}px`
  //   }

  //   const onMouseUpTopResize = event => {
  //     document.removeEventListener("mousemove", onMouseMoveTopResize)
  //   }

  //   const onMouseDownTopResize = event => {
  //     y = event.clientY
  //     const styles = window.getComputedStyle(resizeableEle)
  //     resizeableEle.style.bottom = styles.bottom
  //     resizeableEle.style.top = null
  //     document.addEventListener("mousemove", onMouseMoveTopResize)
  //     document.addEventListener("mouseup", onMouseUpTopResize)
  //   }

  //   // Bottom resize
  //   const onMouseMoveBottomResize = event => {
  //     const dy = event.clientY - y
  //     height = height + dy
  //     y = event.clientY
  //     resizeableEle.style.height = `${height}px`
  //   }

  //   const onMouseUpBottomResize = event => {
  //     document.removeEventListener("mousemove", onMouseMoveBottomResize)
  //   }

  //   const onMouseDownBottomResize = event => {
  //     y = event.clientY
  //     const styles = window.getComputedStyle(resizeableEle)
  //     resizeableEle.style.top = styles.top
  //     resizeableEle.style.bottom = null
  //     document.addEventListener("mousemove", onMouseMoveBottomResize)
  //     document.addEventListener("mouseup", onMouseUpBottomResize)
  //   }

  //   // Left resize
  //   const onMouseMoveLeftResize = event => {
  //     const dx = event.clientX - x
  //     x = event.clientX
  //     width = width - dx
  //     resizeableEle.style.width = `${width}px`
  //   }

  //   const onMouseUpLeftResize = event => {
  //     document.removeEventListener("mousemove", onMouseMoveLeftResize)
  //   }

  //   const onMouseDownLeftResize = event => {
  //     x = event.clientX
  //     resizeableEle.style.right = styles.right
  //     resizeableEle.style.left = null
  //     document.addEventListener("mousemove", onMouseMoveLeftResize)
  //     document.addEventListener("mouseup", onMouseUpLeftResize)
  //   }

  //   // Add mouse down event listene
  //   const resizerRight = refRight.current
  //   resizerRight.addEventListener("mousedown", onMouseDownRightResize)
  //   const resizerTop = refTop.current
  //   resizerTop.addEventListener("mousedown", onMouseDownTopResize)
  //   const resizerBottom = refBottom.current
  //   resizerBottom.addEventListener("mousedown", onMouseDownBottomResize)
  //   const resizerLeft = refLeft.current
  //   resizerLeft.addEventListener("mousedown", onMouseDownLeftResize)

  //   return () => {
  //     resizerRight.removeEventListener("mousedown", onMouseDownRightResize)
  //     resizerTop.removeEventListener("mousedown", onMouseDownTopResize)
  //     resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize)
  //     resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize)
  //   }
  // }, [])

  // return (
  //   <Container>
  //     <Resizeable ref={ref}>
  //       <ResizerL ref={refLeft} />
  //       <ResizerT ref={refTop} />
  //       <ResizerR ref={refRight} />
  //       <ResizerB ref={refBottom} />
  //     </Resizeable>
  //   </Container>

  // )
)
