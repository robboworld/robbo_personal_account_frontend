

import { handleActions } from 'redux-actions'

import {
    clearProjectPageState,
    getProjectPageById,
    getProjectPageByIdFailed, getProjectPageByIdSuccess,
    onChangeProjectPageInstruction,
    onChangeProjectPageNotes,
    onChangeProjectPageTitle,
    onSharedProject,
    updateProjectPage,
    updateProjectPageFailed, updateProjectPageSuccess,
} from '@/actions'

const INITIAL_STATE = {
    projectPage: {},
    loading: false,
}

export default handleActions({
    [getProjectPageById](state, action) {
        return { ...state, loading: true }
    },
    [getProjectPageByIdSuccess](state, action) {
        return { ...state, loading: false, projectPage: action.payload.response.data.projectPage }
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
        return { ...state, loading: true }
    },
    [onChangeProjectPageTitle](state, action) {
        return { ...state, projectPage: { ...state.projectPage, title: action.payload.title } }
    },
    [onChangeProjectPageInstruction](state, action) {
        return { ...state, projectPage: { ...state.projectPage, instruction: action.payload.instruction } }
    },
    [onChangeProjectPageNotes](state, action) {
        return { ...state, projectPage: { ...state.projectPage, notes: action.payload.notes } }
    },
    [onSharedProject](state, action) {
        return { ...state, projectPage: { ...state.projectPage, isShared: action.payload.isShared } }
    },
    [clearProjectPageState](state, action) {
        return { ...state, loading: false, projectPage: {} }
    },
}, INITIAL_STATE)

export const getProjectPage = state => state.projectPage
export const getProjectPageLoading = state => state.loading 