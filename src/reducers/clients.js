import { handleActions } from 'redux-actions'

import {
    getClientsSuccess, getClientsFailed,
    clearClientsState, getClients, addNewParentEmailOnChange,

} from '@/actions'

const INITIAL_STATE = {
    loading: false,
    parents: [],
    newParent: {
        id: '',
        email: '',
        password: '',
        nickname: '',
        lastname: '',
        firstname: '',
        middlename: '',
    },
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
    // [addNewParentEmailOnChange](state, action) {
    //     return {...state, }
    // }
}, INITIAL_STATE)

export const getClientsState = state => state
export const getNewParent = state => state.newParent