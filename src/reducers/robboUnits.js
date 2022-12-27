import { handleActions } from 'redux-actions'

import {
    createRobboUnitFailed,
    createRobboUnitSuccess,
    deleteRobboUnitFailed,
    deleteRobboUnitRequest,
    deleteRobboUnitSuccess,
    getRobboUnitsByUnitAdminIdFailed,
    getRobboUnitsByUnitAdminIdRequest,
    getRobboUnitsByUnitAdminIdSuccess,
    getRobboUnitsFailed,
    getRobboUnitsSuccess,
    clearRobboUnitsPage,
    getRobboUnitsRequest,
    createRobboUnitRequest,
} from '@/actions'

const INITIAL_STATE = {
    robboUnits: [],
    loading: true,
}

export default handleActions({
    [getRobboUnitsRequest](state) {
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
    [createRobboUnitRequest](state) {
        return { ...state, loading: true }
    },
    [createRobboUnitSuccess](state, { payload }) {
        const { response } = payload
        return {
            ...state,
            loading: false,
            robboUnits: [...state.robboUnits, { ...response }],
        }
    },
    [createRobboUnitFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
    [clearRobboUnitsPage](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getRobboUnitsState = state => state