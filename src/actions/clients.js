import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    GET_CLIENTS, GET_CLIENTS_SUCCESS, GET_CLIENTS_FAILED,
    GET_CLIENT_PAGE_BY_ID, GET_CLIENT_PAGE_BY_ID_SUCCESS, GET_CLIENT_PAGE_BY_ID_FAILED,
    CLEAR_CLIENT_PAGE_STATE, CLEAR_CLIENTS_STATE,
} from '@/constants'

export const getClients = createAction(GET_CLIENTS, token => {
    return {
        token,
    }
})

export const getClientsSuccess = createAction(GET_CLIENTS_SUCCESS, clients => {
    return {
        clients,
    }
})

export const getClientsFailed = createAction(GET_CLIENTS_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})


export const getClientPageById = createAction(GET_CLIENT_PAGE_BY_ID, (token, id) => {
    return {
        token,
        id,
    }
})

export const getClientPageByIdSuccess = createAction(GET_CLIENT_PAGE_BY_ID_SUCCESS, client => {
    return {
        client,
    }
})

export const getClientPageByIdFailed = createAction(GET_CLIENT_PAGE_BY_ID_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const clearClientPageState = createAction(CLEAR_CLIENT_PAGE_STATE)
export const clearClientsState = createAction(CLEAR_CLIENTS_STATE)