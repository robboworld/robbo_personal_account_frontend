import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    GET_CLIENTS, GET_CLIENTS_SUCCESS, GET_CLIENTS_FAILED,
    GET_CLIENT_PAGE_BY_ID, GET_CLIENT_PAGE_BY_ID_SUCCESS, GET_CLIENT_PAGE_BY_ID_FAILED,
    CLEAR_CLIENT_PAGE_STATE, CLEAR_CLIENTS_STATE, ADD_NEW_PARENT_EMAIL_ONCHANGE, ADD_NEW_PARENT_PASSWORD_ONCHANGE, ADD_NEW_PARENT_MIDDLENAME_ONCHANGE, ADD_NEW_PARENT_FIRSTNAME_ONCHANGE, ADD_NEW_PARENT_LASTNAME_ONCHANGE,
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

export const addNewParentEmailOnChange = createAction(ADD_NEW_PARENT_EMAIL_ONCHANGE, email => {
    return {
        email,
    }
})

export const addNewParentPasswordOnChange = createAction(ADD_NEW_PARENT_PASSWORD_ONCHANGE, password => {
    return {
        password,
    }
})

export const addNewParentNicknameOnChange = createAction(ADD_NEW_PARENT_MIDDLENAME_ONCHANGE, nickname => {
    return {
        nickname,
    }
})

export const addNewParentFirstnameOnChange = createAction(ADD_NEW_PARENT_FIRSTNAME_ONCHANGE, firstname => {
    return {
        firstname,
    }
})

export const addNewParentLastnameOnChange = createAction(ADD_NEW_PARENT_LASTNAME_ONCHANGE, lastname => {
    return {
        lastname,
    }
})

export const addNewParentMiddlenameOnChange = createAction(ADD_NEW_PARENT_MIDDLENAME_ONCHANGE, middlename => {
    return {
        middlename,
    }
})