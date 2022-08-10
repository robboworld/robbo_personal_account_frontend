import { combineReducers } from 'redux'

import login from './login'
import myProjects from './myProjects'
import projectPage from './projectPage'
import myCourses from './myCourses'
import coursePage from './coursePage'
import profile from './profile'
import teachers from './teachers'
import clients from './clients'
import clientPage from './clientPage'
import unitAdmins from './unitAdmins'

export const rootReducer = combineReducers({
  login,
  myProjects,
  projectPage,
  myCourses,
  coursePage,
  profile,
  teachers,
  clients,
  clientPage,
  unitAdmins,
})
