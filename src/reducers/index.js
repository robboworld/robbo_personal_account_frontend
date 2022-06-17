import { combineReducers } from 'redux'

import login from './login'
import projectPage from './projectPage'

export const rootReducer = combineReducers({
  login,
  projectPage,
})
