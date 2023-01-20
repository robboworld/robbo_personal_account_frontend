
import { handleActions } from 'redux-actions'

import {
    createRobboGroupFailed,
    createRobboGroupRequest,
    createRobboGroupSuccess,
    getRobboGroupsByRobboUnitIdRequest,
    getRobboGroupsByRobboUnitIdSuccess,
    getRobboGroupsByRobboUnitIdFailed,
    deleteRobboGroupRequest,
    deleteRobboGroupSuccess,
    deleteRobboGroupFailed,
    searchRobboGroupsByTitleRequest,
    searchRobboGroupsByTitleFailed,
    searchRobboGroupsByTitleSuccess,
    getRobboGroupsByAccessTokenSuccess,
    getRobboGroupsByAccessTokenFailed,
    getRobboGroupsByTeacherId,
    getRobboGroupsByTeacherIdFailed,
    getRobboGroupsByTeacherIdSuccess,
    getAllRobboGroupsSuccess,
    getAllRobboGroupsFailed,
    clearRobboGroupsPage,
    getAllRobboGroupsRequest,
    getRobboGroupsByAccessTokenRequest,
    getAllRobboGroupsForUnitAdminRequest,
    getAllRobboGroupsForUnitAdminSuccess,
    getAllRobboGroupsForUnitAdminFailed,
} from '@/actions'

const INITIAL_STATE = {
    robboGroups: [],
    countRows: 0,
    searchResult: [],
    loading: true,
}

export default handleActions({
    [createRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [createRobboGroupSuccess](state, { payload }) {
        const { response } = payload
        return {
            ...state,
            loading: false,
            robboGroups: [...state.robboGroups, ...response],
        }
    },
    [createRobboGroupFailed](state) {
        return { ...state, loading: false }
    },
    [getRobboGroupsByRobboUnitIdRequest](state) {
        return { ...state, loading: true }
    },
    [getRobboGroupsByRobboUnitIdSuccess](state, { payload }) {
        return {
            ...state,
            loading: false,
            robboGroups: payload.response.robboGroups,
            countRows: payload.response.countRows,
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
    [searchRobboGroupsByTitleRequest](state) {
        return { ...state, loading: true }
    },
    [searchRobboGroupsByTitleSuccess](state, action) {
        return { ...state, loading: false, searchResult: action.payload.response }
    },
    [searchRobboGroupsByTitleFailed](state) {
        return { ...state, loading: false }
    },
    [getRobboGroupsByAccessTokenRequest](state) {
        return { ...state, loading: true }
    },
    [getRobboGroupsByAccessTokenSuccess](state, action) {
        return { ...state, loading: false, robboGroups: action.payload.response }
    },
    [getRobboGroupsByAccessTokenFailed](state) {
        return { ...state, loading: false }
    },
    [getRobboGroupsByTeacherId](state) {
        return { ...state, loading: true }
    },
    [getRobboGroupsByTeacherIdSuccess](state, action) {
        return { ...state, loading: false, robboGroups: action.payload.response }
    },
    [getRobboGroupsByTeacherIdFailed](state) {
        return { ...state, loading: false }
    },
    [getAllRobboGroupsRequest](state) {
        return { ...state, loading: true }
    },
    [getAllRobboGroupsSuccess](state, { payload }) {
        return { ...state, loading: false, robboGroups: payload.response.robboGroups, countRows: payload.response.countRows }
    },
    [getAllRobboGroupsFailed](state, action) {
        return { ...state, loading: false }
    },
    [getAllRobboGroupsForUnitAdminRequest](state) {
        return { ...state, loading: true }
    },
    [getAllRobboGroupsForUnitAdminSuccess](state, action) {
        return { ...state, loading: false, robboGroups: action.payload.response }
    },
    [getAllRobboGroupsForUnitAdminFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearRobboGroupsPage](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getRobboGroupsState = state => state