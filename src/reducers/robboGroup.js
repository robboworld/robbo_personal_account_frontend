import { handleActions } from 'redux-actions'

import {
    addStudentToRobboGroupFailed,
    addStudentToRobboGroupRequest,
    addStudentToRobboGroupSuccess,
    deleteStudentFromRobboGroupFailed,
    deleteStudentFromRobboGroupRequest,
    deleteStudentFromRobboGroupSuccess,
    getRobboGroupByIdFailed,
    getRobboGroupByIdRequest,
    getRobboGroupByIdSuccess,
    clearRobboGroupPage,
} from '@/actions'

const INITIAL_STATE = {
    robboGroup: {},
    loading: true,
}

export default handleActions({
    [getRobboGroupByIdRequest](state) {
        return { ...state, loading: true }
    },
    [getRobboGroupByIdSuccess](state, action) {
        const { response } = action.payload
        return {
            ...state,
            loading: false,
            robboGroup: response,
        }
    },
    [getRobboGroupByIdFailed](state) {
        return { ...state, loading: false }
    },
    [addStudentToRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [addStudentToRobboGroupSuccess](state) {
        return { ...state, loading: false }
    },
    [addStudentToRobboGroupFailed](state) {
        return { ...state, loading: false }
    },
    [deleteStudentFromRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [deleteStudentFromRobboGroupSuccess](state) {
        return { ...state, loading: false }
    },
    [deleteStudentFromRobboGroupFailed](state) {
        return { ...state, loading: false }
    },
    [clearRobboGroupPage](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getRobboGroupState = state => state