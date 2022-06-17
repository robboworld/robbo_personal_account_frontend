import { handleActions } from "redux-actions";

import {
    createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPagesFailed, getAllProjectPagesSuccess,
    getProjectPageByIdFailed, getProjectPageByIdSuccess,
    updateProjectPageFailed, updateProjectPageSuccess,
} from "@/actions";

const INITIAL_STATE = {

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