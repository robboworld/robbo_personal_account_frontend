import { combineReducers } from 'redux'

import login from './login'
import myProjects from './myProjects'
import projectPage from './projectPage'
import myCourses from './myCourses'
import coursePage from './coursePage'
import profile from './profile'
import app from './app'

export const rootReducer = combineReducers({
  login,
  myProjects,
  projectPage,
  myCourses,
  coursePage,
  profile,
  app,
})
