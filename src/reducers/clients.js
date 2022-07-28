import { handleActions } from 'redux-actions'

import {
    getClientsSuccess, getClientsFailed, clearClientsState, getClients,
} from '@/actions'

const INITIAL_STATE = {
    loading: false,
    parents: [],
}

export default handleActions({
    [getClients](state, action) {
        return { ...state, loading: true }
    },
    [getClientsSuccess](state, action) {
        return { ...state, loading: false, parents: action.payload.clients }
    },
    [getClientsFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearClientsState](state, action) {
        return { ...state }
    },
}, INITIAL_STATE)

export const getClientsState = state => state