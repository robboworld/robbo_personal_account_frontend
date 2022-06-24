

import { handleActions } from "redux-actions"

import {
    getProjectPageByIdFailed, getProjectPageByIdSuccess,
    onChangeProjectPageTitle,
    onSharedProject,
    updateProjectPageFailed, updateProjectPageSuccess,
} from "@/actions"

const INITIAL_STATE = {
    projectPage:
    {
        id: '1',
        title: 'Untitled-1',
        date: '2022.06.15',
        isShared: false,
        linkScratch: 'http://0.0.0.0:8601/',
        instructions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        notes: '',
    },

}

export default handleActions({
    [getProjectPageByIdSuccess](state, action) {
        return { ...state }
    },
    [getProjectPageByIdFailed](state, action) {
        return { ...state }
    },
    [updateProjectPageSuccess](state, action) {
        return { ...state }
    },
    [updateProjectPageFailed](state, action) {
        return { ...state }
    },
    [onChangeProjectPageTitle](state, action) {
        return { ...state, projectPage: { ...state.projectPage, title: action.payload.title } }
    },
    [onSharedProject](state, action) {
        return { ...state, projectPage: { ...state.projectPage, isShared: action.payload.isShared } }
    }
}, INITIAL_STATE)

export const getProjectPage = state => state.projectPage