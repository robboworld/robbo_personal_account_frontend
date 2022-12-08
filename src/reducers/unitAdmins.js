import { handleActions } from 'redux-actions'

import {
    createUnitAdmin, createUnitAdminFailed, createUnitAdminSuccess,
    deleteUnitAdmin, deleteUnitAdminFailed,
    deleteUnitAdminForRobboUnitFailed,
    deleteUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitSuccess,
    deleteUnitAdminSuccess, getUnitAdmins,
    getUnitAdminsByRobboUnitIdFailed,
    getUnitAdminsByRobboUnitIdRequest,
    getUnitAdminsByRobboUnitIdSuccess,
    getUnitAdminsFailed, getUnitAdminsSuccess,
    searchUnitAdminsByEmailFailed, searchUnitAdminsByEmailRequest,
    searchUnitAdminsByEmailSuccess, setNewUnitAdminForRobboUnitFailed,
    setNewUnitAdminForRobboUnitRequest, setNewUnitAdminForRobboUnitSuccess,
    clearUnitAdminsPageState,
} from '@/actions'

const INITIAL_STATE = {
    unitAdmins: [],
    loading: true,
    searchResult: [],
}

export default handleActions({
    [getUnitAdmins](state) {
        return { ...state, loading: true }
    },
    [getUnitAdminsSuccess](state, action) {
        return { ...state, unitAdmins: action.payload.response, loading: false }
    },
    [getUnitAdminsFailed](state, action) {
        return { ...state, loading: false }
    },
    [deleteUnitAdmin](state, action) {
        return { ...state, loading: true }
    },
    [deleteUnitAdminSuccess](state, action) {
        console.log(action)
        const { unitAdminIndex } = action.payload
        const newUnitAdmins = [...state.unitAdmins]
        newUnitAdmins.splice(unitAdminIndex, 1)
        return { ...state, loading: false, unitAdmins: newUnitAdmins }
    },
    [deleteUnitAdminFailed](state, action) {
        return { ...state, loading: false }
    },
    [createUnitAdmin](state) {
        return { ...state, loading: true }
    },
    [createUnitAdminSuccess](state, action) {
        console.log(action)
        const { response, unitAdmin } = action.payload
        return {
            ...state,
            loading: false,
            unitAdmins: [...state.unitAdmins, { userHttp: { id: response.unitAdminId, ...unitAdmin } }],
        }
    },
    [createUnitAdminFailed](state) {
        return { ...state, loading: false }
    },
    [searchUnitAdminsByEmailRequest](state) {
        return { ...state, loading: true }
    },
    [searchUnitAdminsByEmailSuccess](state, action) {
        return { ...state, loading: false, searchResult: action.payload.response }
    },
    [searchUnitAdminsByEmailFailed](state) {
        return { ...state, loading: false }
    },
    [getUnitAdminsByRobboUnitIdRequest](state) {
        return { ...state, loading: true }
    },
    [getUnitAdminsByRobboUnitIdSuccess](state, action) {
        return { ...state, unitAdmins: action.payload.response, loading: false }
    },
    [getUnitAdminsByRobboUnitIdFailed](state) {
        return { ...state, loading: false }
    },
    [setNewUnitAdminForRobboUnitRequest](state) {
        return { ...state, loading: true }
    },
    [setNewUnitAdminForRobboUnitSuccess](state) {
        return { ...state, loading: false }
    },
    [setNewUnitAdminForRobboUnitFailed](state) {
        return { ...state, loading: false }
    },
    [deleteUnitAdminForRobboUnitRequest](state) {
        return { ...state, loading: true }
    },
    [deleteUnitAdminForRobboUnitSuccess](state) {
        return { ...state, loading: false }
    },
    [deleteUnitAdminForRobboUnitFailed](state) {
        return { ...state, loading: false }
    },
    [clearUnitAdminsPageState](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getUnitAdminsState = state => state