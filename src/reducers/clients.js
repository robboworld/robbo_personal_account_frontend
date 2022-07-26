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
            childrens: [
                { name: 'Мария Ивановна Иванова' },
                { name: 'Алексей Иванович Иванов' },
            ],
        },
        {
            id: 2,
            name: 'Сергей Сергеевич Сергеев',
            childrens: [
                { name: 'Мария Сергеевна Сергеева' },
            ],
        },
        {
            id: 3,
            name: 'Василий Вальевич Васильев',
            childrens: [
            ],
        },
    ],
}

export default handleActions({
    [getClientsSuccess](state, action) {
        return { ...state }
    },
    [getClientsFailed](state, action) {
        return { ...state }
    },
    [clearClientsState](state, action) {
        return { ...state }
    },
}, INITIAL_STATE)

export const getParents = state => state.parents