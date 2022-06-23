import { handleActions } from "redux-actions";

import {
    createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPagesFailed, getAllProjectPagesSuccess,
    getProjectPageByIdFailed, getProjectPageByIdSuccess,
    updateProjectPageFailed, updateProjectPageSuccess,
} from "@/actions";

const INITIAL_STATE = {
    newProjectId: '',
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
    ]
}

export default handleActions({
    [getAllProjectPagesSuccess](state, action) {
        return { ...state }
    },
    [getAllProjectPagesFailed](state, action) {
        return { ...state }
    },
    [getProjectPageByIdSuccess](state, action) {
        return { ...state }
    },
    [getProjectPageByIdFailed](state, action) {
        return { ...state }
    },
    [createProjectPageSuccess](state, action) {
        return { ...state }
    },
    [createProjectPageFailed](state, action) {
        return { ...state }
    },
    [updateProjectPageSuccess](state, action) {
        return { ...state }
    },
    [updateProjectPageFailed](state, action) {
        return { ...state }
    },
    [deleteProjectPageSuccess](state, action) {
        return { ...state }
    },
    [deleteProjectPageFailed](state, action) {
        return { ...state }
    },
}, INITIAL_STATE)

export const getProjectPages = state => state.projectPages;