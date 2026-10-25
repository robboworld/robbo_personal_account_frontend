import { handleActions } from 'redux-actions'

import {
  clearProjectPageState,
  getProjectPageById,
  getProjectPageByIdFailed,
  getProjectPageByIdSuccess,
  onSharedProject,
  updateProjectPage,
  updateProjectPageFailed,
  updateProjectPageSuccess,
} from '@/actions'

const INITIAL_STATE = {
  projectPage: {},
  playToken: null,
  loading: true,
  loadError: null,
}

export default handleActions(
  {
    [getProjectPageById](state, action) {
      return { ...state, loading: true, loadError: null }
    },
    [getProjectPageByIdSuccess](state, action) {
      return {
        ...state,
        loading: false,
        projectPage: action.payload.projectPage,
        playToken: action.payload.playToken || null,
      }
    },
    [getProjectPageByIdFailed](state, action) {
      return { ...state, loading: false, loadError: action.payload?.err || { status: 0 } }
    },
    [updateProjectPage](state, action) {
      return { ...state, loading: true }
    },
    [updateProjectPageSuccess](state, action) {
      return { ...state, loading: false }
    },
    [updateProjectPageFailed](state, action) {
      return { ...state, loading: false }
    },
    [onSharedProject](state, action) {
      return { ...state, projectPage: { ...state.projectPage, isShared: action.payload.isShared } }
    },
    [clearProjectPageState](state, action) {
      return INITIAL_STATE
    },
  },
  INITIAL_STATE,
)

export const getProjectPageState = state => state
export const getProjectPageLoading = state => state.loading
export const getProjectPlayToken = state => state.playToken
