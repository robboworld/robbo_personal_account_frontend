import { handleActions } from 'redux-actions'

import {
    createRobboUnit,
    createRobboUnitFailed,
    createRobboUnitSuccess,
    deleteRobboUnitFailed,
    deleteRobboUnitRequest,
    deleteRobboUnitSuccess,
    getRobboUnits, getRobboUnitsByUnitAdminIdFailed, getRobboUnitsByUnitAdminIdRequest,
    getRobboUnitsByUnitAdminIdSuccess, getRobboUnitsFailed,
    getRobboUnitsSuccess,
} from '@/actions'

const INITIAL_STATE = {
    robboUnits: [],
    loading: true,
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
    [getRobboUnitsByUnitAdminIdRequest](state) {
        return { ...state, loading: true }
    },
    [getRobboUnitsByUnitAdminIdSuccess](state, action) {
        return { ...state, robboUnits: action.payload.response, loading: false }
    },
    [getRobboUnitsByUnitAdminIdFailed](state, action) {
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
            robboUnits: [...state.robboUnits, { id: response.robboUnitId, ...robboUnit }],
        }
    },
    [createRobboUnitFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
}, INITIAL_STATE)

export const getRobboUnitsState = state => state