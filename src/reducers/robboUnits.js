import { handleActions } from 'redux-actions'

import {
    createRobboUnit,
    createRobboUnitFailed,
    createRobboUnitSuccess,
    deleteRobboUnitFailed,
    deleteRobboUnitRequest,
    deleteRobboUnitSuccess,
    getRobboUnitById,
    getRobboUnitByIdFailed,
    getRobboUnitByIdSuccess,
    getRobboUnits, getRobboUnitsFailed, getRobboUnitsSuccess, updateRobboUnit, updateRobboUnitFailed, updateRobboUnitSuccess,
} from '@/actions'

const INITIAL_STATE = {
    robboUnits: [],
    robboUnit: {},
    loading: false,
}

export default handleActions({
    [getRobboUnits](state) {
        return { ...state, loading: true }
    },
    [getRobboUnitsSuccess](state, action) {
        return { ...state, robboUnits: action.payload.response, loading: false }
    },
    [getRobboUnitsFailed](state, action) {
        return { ...state, loading: false }
    },
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
    [deleteRobboUnitRequest](state) {
        return { ...state, loading: true }
    },
    [deleteRobboUnitSuccess](state, action) {
        const { robboUnitIndex } = action.payload
        const newRobboUnits = [...state.robboUnits]
        newRobboUnits.splice(robboUnitIndex, 1)
        return { ...state, loading: false, robboUnits: newRobboUnits }
    },
    [deleteRobboUnitFailed](state, action) {
        return { ...state, loading: false }
    },
    [createRobboUnit](state) {
        return { ...state, loading: true }
    },
    [createRobboUnitSuccess](state, action) {
        const { response, robboUnit } = action.payload
        return {
            ...state,
            loading: false,
            robboUnits: [...state.robboUnits, { id: response.Id, ...robboUnit }],
        }
    },
    [createRobboUnitFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
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

export const getRobboUnitsState = state => state