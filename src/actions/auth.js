import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_IN,
    SIGN_UP_FAILED, SIGN_UP, SIGN_UP_SUCCESS,
    SIGN_OUT, SIGN_OUT_SUCCESS, SIGN_OUT_FAILED,
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
    CLEAR_LOGIN_STATE,
} from '@/constants'

export const signInRequest = createAction(SIGN_IN, ({ email, password, role }) => {
    return {
        email,
        password,
        role,
    }
})

export const signInSucces = createAction(SIGN_IN_SUCCESS, response => {
    return {
        response,
    }
})

export const signInFailed = createAction(SIGN_IN_FAILED, error => {
    toast.error(error)
    return {
        error,
    }
})

export const signUpRequest = createAction(SIGN_UP, user => {
    return {
        user,
    }
})

export const signUpSuccess = createAction(SIGN_UP_SUCCESS, response => {
    return {
        response,
    }
})

export const signUpFailed = createAction(SIGN_UP_FAILED, error => {
    toast.error(error)
    return {
        error,
    }
})

export const clearLoginState = createAction(CLEAR_LOGIN_STATE)
export const signOutRequest = createAction(SIGN_OUT)
export const signOutSuccess = createAction(SIGN_OUT_SUCCESS)
export const signOutFailed = createAction(SIGN_OUT_FAILED)
export const checkAuthRequest = createAction(CHECK_AUTH, token => {
    return {
        token,
    }
})
export const checkAuthSuccess = createAction(CHECK_AUTH_SUCCESS, response => {
    return {
        id: response.data.id,
        role: response.data.role,
    }
})
export const checkAuthFailed = createAction(CHECK_AUTH_FAILED, error => {
    toast.error(error)
    return {
        error,
    }
})