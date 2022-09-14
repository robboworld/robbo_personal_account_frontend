import { combineReducers } from 'redux'

import login from './login'
import myProjects from './myProjects'
import projectPage from './projectPage'
import myCourses from './myCourses'
import coursePage from './coursePage'
import profile from './profile'
import teachers from './teachers'
import clients from './clients'
import unitAdmins from './unitAdmins'
import robboUnits from './robboUnits'
import robboUnit from './robboUnit'
import robboGroup from './robboGroup'
import robboGroups from './robboGroups'

export const rootReducer = combineReducers({
  login,
  myProjects,
  projectPage,
  myCourses,
  coursePage,
  profile,
  teachers,
  clients,
  unitAdmins,
  robboUnits,
  robboUnit,
  robboGroup,
  robboGroups,
})
