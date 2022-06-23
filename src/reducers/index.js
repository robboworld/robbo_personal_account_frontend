import { combineReducers } from 'redux'

import login from './login'
import myProjects from './myProjects'
import projectPage from './projectPage'

export const rootReducer = combineReducers({
  login,
  myProjects,
  projectPage,
})
