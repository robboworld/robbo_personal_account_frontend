
import { handleActions } from 'redux-actions'

import {
    createRobboGroupFailed,
    createRobboGroupRequest, createRobboGroupSuccess,
    getRobboGroupsByRobboUnitIdRequest, getRobboGroupsByRobboUnitIdSuccess,
    getRobboGroupsByRobboUnitIdFailed,
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
}, INITIAL_STATE)

export const getRobboGroupsState = state => state