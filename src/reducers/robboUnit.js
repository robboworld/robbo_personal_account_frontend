import { handleActions } from 'redux-actions'

import {
    getRobboUnitById,
    getRobboUnitByIdFailed,
    getRobboUnitByIdSuccess,
    createRobboGroupFailed,
    createRobboGroupRequest,
    createRobboGroupSuccess,
    updateRobboUnit, updateRobboUnitFailed, updateRobboUnitSuccess, getRobboGroupsByRobboUnitIdRequest, getRobboGroupsByRobboUnitIdSuccess, getRobboGroupsByRobboUnitIdFailed,
} from '@/actions'

const INITIAL_STATE = {
    robboUnit: {},
    loading: false,
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
    [createRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [createRobboGroupSuccess](state, action) {
        return { ...state, loading: false }
    },
    [createRobboGroupFailed](state) {
        return { ...state, loading: false }
    },
    [getRobboGroupsByRobboUnitIdRequest](state) {
        return { ...state, loading: true }
    },
    [getRobboGroupsByRobboUnitIdSuccess](state, action) {
        const { response } = action.payload
        console.log(response)
        return {
            ...state,
            loading: false,
            robboUnit: {
                ...state.robboUnit, robboGroups: [...response],
            },
        }
    },
    [getRobboGroupsByRobboUnitIdFailed](state) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getRobboUnitState = state => state