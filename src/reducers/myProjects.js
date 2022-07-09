import { handleActions } from "redux-actions"

import {
    clearMyProjectsState,
    createProjectPage,
    createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPages,
    getAllProjectPagesFailed, getAllProjectPagesSuccess,
} from "@/actions"

const INITIAL_STATE = {
    newProjectId: '',
    loading: false,
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
    [createProjectPageSuccess](state, action) {
        return { ...state, newProjectId: action.payload.response.data.projectId, isFetching: false }
    },
    [createProjectPageFailed](state, action) {
        return { ...state }
    },
    [deleteProjectPageSuccess](state, action) {
        return { ...state }
    },
    [deleteProjectPageFailed](state, action) {
        return { ...state }
    },
    [clearMyProjectsState](state, action) {
        return { ...state, newProjectId: '', loading: false, projectPages: [] }
    },
}, INITIAL_STATE)

export const getProjectPages = state => state.projectPages
export const getNewProjectId = state => state.newProjectId
export const getMyProjectsLoading = state => state.loading