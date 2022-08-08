import { handleActions } from 'redux-actions'

import {
    createUnitAdmin, createUnitAdminFailed, createUnitAdminSuccess,
    deleteUnitAdmin, deleteUnitAdminFailed,
    deleteUnitAdminSuccess, getUnitAdmins,
    getUnitAdminsFailed, getUnitAdminsSuccess,
} from '@/actions'

const INITIAL_STATE = {
    unitAdmins: [],
    loading: false,
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
        return { ...state, loading: false, unitAdmins: [...state.unitAdmins, { userHttp: { id: response.unitAdminId, ...unitAdmin } }] }
    },
    [createUnitAdminFailed](state) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getUnitAdminsState = state => state