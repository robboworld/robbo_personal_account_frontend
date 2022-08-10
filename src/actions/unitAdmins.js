import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import { CREATE_UNIT_ADMIN_FAILED, CREATE_UNIT_ADMIN_REQUEST, CREATE_UNIT_ADMIN_SUCCESS, DELETE_UNIT_ADMIN_FAILED, DELETE_UNIT_ADMIN_REQUEST, DELETE_UNIT_ADMIN_SUCCESS, GET_UNIT_ADMINS, GET_UNIT_ADMINS_FAILED, GET_UNIT_ADMINS_SUCCESS } from '@/constants'
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