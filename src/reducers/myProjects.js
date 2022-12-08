import { handleActions } from 'redux-actions'

import {
    clearMyProjectsState, createProjectPage,
    createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPage, deleteProjectPageFailed,
    deleteProjectPageSuccess, getAllProjectPages,
    getAllProjectPagesFailed, getAllProjectPagesSuccess,
    getProjectPageByAccessTokenFailed, getProjectPageByAccessTokenSuccess, getProjectPagesByAccessToken,
} from '@/actions'

const INITIAL_STATE = {
    newProjectId: '',
    loading: true,
    projectPages: [],
}

export default handleActions({
    [getAllProjectPages](state, action) {
        return { ...state, loading: true }
    },
    [getAllProjectPagesSuccess](state, action) {
        console.log(action)
        return { ...state, loading: false, projectPages: action.payload.response.data.projectPages }
    },
    [getAllProjectPagesFailed](state, action) {
        return { ...state, loading: false }
    },
    [createProjectPage](state) {
        return { ...state, loading: true }
    },
    [createProjectPageSuccess](state, action) {
        return { ...state, newProjectId: action.payload.response.data.projectId, loading: false }
    },
    [createProjectPageFailed](state, action) {
        return { ...state, loading: true }
    },
    [deleteProjectPage](state, action) {
        return { ...state, loading: true }
    },
    [deleteProjectPageSuccess](state, action) {
        const newProjectPages = [...state.projectPages]
        newProjectPages.splice(action.payload.projectPageIndex, 1)
        return { ...state, loading: false, projectPages: newProjectPages }
    },
    [deleteProjectPageFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearMyProjectsState](state, action) {
        return { ...state, newProjectId: '', loading: false, projectPages: [] }
    },
    [getProjectPagesByAccessToken](state) {
        return { ...state, loading: true }
    },
    [getProjectPageByAccessTokenSuccess](state, action) {
        return { ...state, loading: false, projectPages: action.payload.response }
    },
    [getProjectPageByAccessTokenFailed](state, action) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getProjectPagesState = state => state
export const getNewProjectId = state => state.newProjectId
export const getMyProjectsLoading = state => state.loading