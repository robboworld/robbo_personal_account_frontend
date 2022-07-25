import { handleActions } from "redux-actions"

import { getClientPageByIdFailed, getClientPageByIdSuccess } from "@/actions"

const INITIAL_STATE = {
    clientPage:
    {
        id: '1',
        name: 'Иван Иванович Иванов',
        childrens: [
            {name: 'Мария Ивановна Иванова'},
            {name: 'Алексей Иванович Иванов'},
            {name: 'Александра Ивановна Иванова'},
            {name: 'Мария Ивановна Иванова'},
            {name: 'Алексей Иванович Иванов'},
            {name: 'Александра Ивановна Иванова'},
            {name: 'Мария Ивановна Иванова'},
            {name: 'Алексей Иванович Иванов'},
            {name: 'Александра Ивановна Иванова'},
            {name: 'Мария Ивановна Иванова'},
            {name: 'Алексей Иванович Иванов'},
            {name: 'Александра Ивановна Иванова'},
        ],
    },

}

export default handleActions({
    [getClientPageByIdFailed](state, action) {
        return {...state}
    },
    [getClientPageByIdSuccess](state, action) {
        return {...state}
    },
}, INITIAL_STATE)

export const getClientPage = state => state.clientPage