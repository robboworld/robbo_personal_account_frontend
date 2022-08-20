
import { handleActions } from 'redux-actions'

import {
    createRobboGroupFailed,
    createRobboGroupRequest, createRobboGroupSuccess,
    getRobboGroupsByRobboUnitIdRequest, getRobboGroupsByRobboUnitIdSuccess,
    getRobboGroupsByRobboUnitIdFailed,
    deleteRobboGroupRequest,
    deleteRobboGroupSuccess,
    deleteRobboGroupFailed,
} from '@/actions'

const INITIAL_STATE = {
    robboGroups: [],
    loading: false,
}

export default handleActions({
    [createRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [createRobboGroupSuccess](state, action) {
        const { response, robboGroup } = action.payload
        return {
            ...state,
            loading: false,
            robboGroups: [...state.robboGroups, { id: response.robboGroupId, ...robboGroup }],
        }
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
            robboGroups: [...response],

        }
    },
    [getRobboGroupsByRobboUnitIdFailed](state) {
        return { ...state, loading: false }
    },
    [deleteRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [deleteRobboGroupSuccess](state, action) {
        const { robboGroupIndex } = action.payload
        const newRobboGroups = [...state.robboGroups]
        newRobboGroups.splice(robboGroupIndex, 1)
        return { ...state, loading: false, robboGroups: newRobboGroups }
    },
    [deleteRobboGroupFailed](state, action) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getRobboGroupsState = state => state