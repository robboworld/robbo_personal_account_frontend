import { handleActions } from 'redux-actions'

import {
    getClientsSuccess, getClientsFailed, clearClientsState,
} from '@/actions'

const INITIAL_STATE = {
    loading: true,
    parents: [
        {   
            id: 1,
            name: 'Иван Иванович Иванов',
        },
        {   
            id: 2,
            name: 'Сергей Сергеевич Сергеев',
        },
        {   
            id: 3,
            name: 'Василий Вальевич Васильев',
        },
    ],
}

export default handleActions({
    [getClientsSuccess](state, action) {
        return { ...state}
    },
    [getClientsFailed](state, action) {
        return { ...state}
    },
    [clearClientsState](state, action) {
        return {...state}
    },
}, INITIAL_STATE)

export const getParents = state => state.parents