import { combineReducers } from 'redux'

import login from './login'
import myProjects from './myProjects'

export const rootReducer = combineReducers({
  login,
  myProjects,
})
