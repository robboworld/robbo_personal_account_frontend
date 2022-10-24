import { handleActions } from 'redux-actions'

import {
    getRobboUnitById,
    getRobboUnitByIdFailed,
    getRobboUnitByIdSuccess,
    updateRobboUnit, updateRobboUnitFailed, updateRobboUnitSuccess,
} from '@/actions'

const INITIAL_STATE = {
    robboUnit: {},
    loading: true,
}

export default handleActions({
    [getRobboUnitById](state) {
        return { ...state, loading: true }
    },
    [getRobboUnitByIdSuccess](state, action) {
        return { ...state, robboUnit: action.payload.response, loading: false }
    },
    [getRobboUnitByIdFailed](state, action) {
        return { ...state, loading: false }
    },
    // [clearTeachersState](state, action) {
    //     return { ...state, loading: false, robboUnits: [] }
    // },

    [updateRobboUnit](state) {
        return { ...state, loading: true }
    },
    [updateRobboUnitSuccess](state) {
        return { ...state, loading: false }
    },
    [updateRobboUnitFailed](state) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getRobboUnitState = state => state