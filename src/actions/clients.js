import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    GET_CLIENTS, GET_CLIENTS_SUCCESS, GET_CLIENTS_FAILED,
    GET_CLIENT_PAGE_BY_ID, GET_CLIENT_PAGE_BY_ID_SUCCESS, GET_CLIENT_PAGE_BY_ID_FAILED,
    CLEAR_CLIENT_PAGE_STATE, CLEAR_CLIENTS_STATE, ADD_PARENT_REQUEST,
    ADD_PARENT_SUCCESS, ADD_PARENT_FAILED, DELETE_PARENT_REQUEST,
    DELETE_PARENT_SUCCESS, DELETE_PARENT_FAILED, CREATE_CHILDREN_REQUEST,
    CREATE_CHILDREN_SUCCESS, CREATE_CHILDREN_FAILED, DELETE_CHILD_SUCCESS,
    DELETE_CHILD_FAILED,
    DELETE_CHILD_REQUEST,
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

export const addParent = createAction(ADD_PARENT_REQUEST, (token, parent) => {
    return {
        token,
        parent,
    }
})

export const addParentSuccess = createAction(ADD_PARENT_SUCCESS, (response, parent) => {
    toast.success("Родитель успешно добавлен!")
    return {
        response,
        parent,
    }
})

export const addParentFailed = createAction(ADD_PARENT_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteParentRequest = createAction(DELETE_PARENT_REQUEST, (token, parentId, parentIndex) => {
    return {
        token,
        parentId,
        parentIndex,
    }
})

export const deleteParentSuccess = createAction(DELETE_PARENT_SUCCESS, (response, parentIndex) => {
    toast.success("Родитель успешно удален!")
    return {
        response,
        parentIndex,
    }
})

export const deleteParentFailed = createAction(DELETE_PARENT_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const createChildren = createAction(CREATE_CHILDREN_REQUEST, (token, child, parentId) => {
    return {
        token,
        child,
        parentId,
    }
})

export const createChildreSuccess = createAction(CREATE_CHILDREN_SUCCESS, response => {
    toast.success("Ребенок успешно создан!")
    return {
        response,
    }
})

export const createChildrenFailed = createAction(CREATE_CHILDREN_FAILED, err => {
    toast.error("Ошибка при создании ребенка!")
    return {
        err,
    }
})

export const deleteChildRequest = createAction(DELETE_CHILD_REQUEST, (token, childId, childIndex) => {
    return {
        token,
        childId,
        childIndex,
    }
})

export const deleteChildSuccess = createAction(DELETE_CHILD_SUCCESS, (response, childIndex) => {
    toast.success("Ребенок успешно удален!")
    return {
        response,
        childIndex,
    }
})

export const deleteChildFailed = createAction(DELETE_CHILD_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const clearClientPageState = createAction(CLEAR_CLIENT_PAGE_STATE)
export const clearClientsState = createAction(CLEAR_CLIENTS_STATE)