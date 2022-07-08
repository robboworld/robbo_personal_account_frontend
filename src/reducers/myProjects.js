import { handleActions } from "redux-actions"

import {
    createProjectPage,
    createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPages,
    getAllProjectPagesFailed, getAllProjectPagesSuccess,
} from "@/actions"

const INITIAL_STATE = {
    newProjectId: '',
    loading: false,
    projectPages: [
        {
            id: '1',
            title: 'Untitled-1',
            date: '2022.06.15',
            linkScratch: 'http://0.0.0.0:8601/',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
            id: '2',
            title: 'Untitled-2',
            date: '2022.06.15',
            linkScratch: 'http://0.0.0.0:8601/',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
    ],
}

export default handleActions({
    [getAllProjectPages](state, action) {
        return { ...state, loading: true }
    },
    [getAllProjectPagesSuccess](state, action) {
        return { ...state, loading: false }
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
}, INITIAL_STATE)

export const getProjectPages = state => state.projectPages
export const getNewProjectId = state => state.newProjectId
export const getMyProjectsLoading = state => state.loading