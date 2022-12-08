import { handleActions } from 'redux-actions'

import {
    clearProjectPageState, getProjectPageById,
    getProjectPageByIdFailed, getProjectPageByIdSuccess,
    onSharedProject, updateProjectPage,
    updateProjectPageFailed, updateProjectPageSuccess,
} from '@/actions'

const INITIAL_STATE = {
    projectPage: {},
    loading: true,
}

export default handleActions({
    [getProjectPageById](state, action) {
        return { ...state, loading: true }
    },
    [getProjectPageByIdSuccess](state, action) {
        return { ...state, loading: false, projectPage: action.payload.response }
    },
    [getProjectPageByIdFailed](state, action) {
        return { ...state, loading: false }
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
}, INITIAL_STATE)

export const getProjectPageState = state => state
export const getProjectPageLoading = state => state.loading 