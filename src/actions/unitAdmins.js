import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    CREATE_UNIT_ADMIN_FAILED,
    CREATE_UNIT_ADMIN_REQUEST,
    CREATE_UNIT_ADMIN_SUCCESS,
    DELETE_UNIT_ADMIN_FAILED,
    DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_FAILED,
    DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_REQUEST,
    DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_SUCCESS,
    DELETE_UNIT_ADMIN_REQUEST,
    DELETE_UNIT_ADMIN_SUCCESS,
    GET_UNIT_ADMINS,
    GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_FAILED,
    GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_REQUEST,
    GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_SUCCESS,
    GET_UNIT_ADMINS_FAILED,
    GET_UNIT_ADMINS_SUCCESS,
    SEARCH_UNIT_ADMINS_BY_EMAIL_FAILED,
    SEARCH_UNIT_ADMINS_BY_EMAIL_REQUEST,
    SEARCH_UNIT_ADMINS_BY_EMAIL_SUCCESS,
    SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_FAILED,
    SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_REQUEST,
    SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_SUCCESS,
    CLEAR_UNIT_ADMINS_PAGE_STATE,
} from '@/constants'

export const getUnitAdmins = createAction(GET_UNIT_ADMINS, token => {
    return {
        token,
    }
})

export const getUnitAdminsSuccess = createAction(GET_UNIT_ADMINS_SUCCESS, response => {
    return {
        response,
    }
})

export const getUnitAdminsFailed = createAction(GET_UNIT_ADMINS_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const createUnitAdmin = createAction(CREATE_UNIT_ADMIN_REQUEST, (token, unitAdmin) => {
    return {
        token,
        unitAdmin,
    }
})

export const createUnitAdminSuccess = createAction(CREATE_UNIT_ADMIN_SUCCESS, (response, unitAdmin) => {
    toast.success("Unit Админ успешно создан!")
    return {
        response,
        unitAdmin,
    }
})

export const createUnitAdminFailed = createAction(CREATE_UNIT_ADMIN_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteUnitAdmin = createAction(DELETE_UNIT_ADMIN_REQUEST, (token, unitAdminId, unitAdminIndex) => {
    return {
        token,
        unitAdminId,
        unitAdminIndex,
    }
})

export const deleteUnitAdminSuccess = createAction(DELETE_UNIT_ADMIN_SUCCESS, (response, unitAdminIndex) => {
    toast.success("Unit Админ успешно удален!")
    return {
        response,
        unitAdminIndex,
    }
})

export const deleteUnitAdminFailed = createAction(DELETE_UNIT_ADMIN_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const getUnitAdminsByRobboUnitIdRequest = createAction(GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_REQUEST, (token, robboUnitId) => {
    return {
        token,
        robboUnitId,
    }
})

export const getUnitAdminsByRobboUnitIdSuccess = createAction(GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_SUCCESS, response => {
    return {
        response,
    }
})

export const getUnitAdminsByRobboUnitIdFailed = createAction(GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID_FAILED, err => {
    toast.err(err)
    return {
        err,
    }
})

export const searchUnitAdminsByEmailRequest = createAction(SEARCH_UNIT_ADMINS_BY_EMAIL_REQUEST, (token, email) => {
    return {
        token,
        email,
    }
})

export const searchUnitAdminsByEmailSuccess = createAction(SEARCH_UNIT_ADMINS_BY_EMAIL_SUCCESS, response => {
    return {
        response,
    }
})

export const searchUnitAdminsByEmailFailed = createAction(SEARCH_UNIT_ADMINS_BY_EMAIL_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const setNewUnitAdminForRobboUnitRequest = createAction(SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_REQUEST, (token, unitAdminId, robboUnitId) => {
    return {
        token,
        unitAdminId,
        robboUnitId,
    }
})

export const setNewUnitAdminForRobboUnitSuccess = createAction(SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_SUCCESS, response => {
    toast.success("Unit Admin успешно назначен")
    return {
        response,
    }
})

export const setNewUnitAdminForRobboUnitFailed = createAction(SET_NEW_UNIT_ADMIN_FOR_ROBBO_UNIT_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteUnitAdminForRobboUnitRequest = createAction(DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_REQUEST, (token, unitAdminId, robboUnitId) => {
    return {
        token,
        unitAdminId,
        robboUnitId,
    }
})

export const deleteUnitAdminForRobboUnitSuccess = createAction(DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_SUCCESS, response => {
    toast.error("Unit Админ успешно отстранен")
    return {
        response,
    }
})

export const deleteUnitAdminForRobboUnitFailed = createAction(DELETE_UNIT_ADMIN_FOR_ROBBO_UNIT_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const clearUnitAdminsPageState = createAction(CLEAR_UNIT_ADMINS_PAGE_STATE)