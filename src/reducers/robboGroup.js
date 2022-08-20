import { handleActions } from 'redux-actions'

import {
    addStudentToRobboGroupFailed,
    addStudentToRobboGroupRequest,
    addStudentToRobboGroupSuccess,
    getRobboGroupByIdFailed,
    getRobboGroupByIdRequest, getRobboGroupByIdSuccess,
} from '@/actions'

const INITIAL_STATE = {
    robboGroup: {},
    loading: false,
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

}, INITIAL_STATE)

export const getRobboGroupState = state => state