import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    EMAIL_ONCHANGE, PASSWORD_ONCHANGE,
    SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_IN,
    SIGN_UP_FAILED, SIGN_UP, SIGN_UP_SUCCESS,
    SIGN_OUT, SIGN_OUT_SUCCESS, SIGN_OUT_FAILED,
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
    NICKNAME_ONCHANGE, LASTNAME_ONCHANGE, FIRSTNAME_ONCHANGE,
    MIDDLENAME_ONCHANGE, SIGN_IN_ROLE_ONCHANGE, SIGN_UP_ROLE_ONCHANGE, CLEAR_LOGIN_STATE,
} from '@/constants'


export const emailOnChange = createAction(EMAIL_ONCHANGE, email => {
    return {
        email,
    }
})

export const passwordOnChange = createAction(PASSWORD_ONCHANGE, password => {
    return {
        password,
    }
})

export const signInRoleOnChange = createAction(SIGN_IN_ROLE_ONCHANGE, role => {
    return {
        role,
    }
})

export const signUpRoleOnChange = createAction(SIGN_UP_ROLE_ONCHANGE, role => {
    return {
        role,
    }
})

export const nicknameOnChange = createAction(NICKNAME_ONCHANGE, nickname => {
    return {
        nickname,
    }
})

export const lastnameOnChange = createAction(LASTNAME_ONCHANGE, lastname => {
    return {
        lastname,
    }
})

export const firstnameOnChange = createAction(FIRSTNAME_ONCHANGE, firstname => {
    return {
        firstname,
    }
})

export const middlenameOnChange = createAction(MIDDLENAME_ONCHANGE, middlename => {
    return {
        middlename,
    }
})

export const signInRequest = createAction(SIGN_IN, (email, password, role) => {
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

export const signUpRequest = createAction(SIGN_UP, (user, role) => {
    return {
        user,
        role,
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