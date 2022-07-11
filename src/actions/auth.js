import { createAction } from "redux-actions"

import { parseJwt } from "@/helpers"

import {
    EMAIL_ONCHANGE,
    PASSWORD_ONCHANGE,
    ROLE_ONCHANGE,
    SIGN_IN_SUCCESS, SIGN_IN_FAILED, SIGN_IN,
    SIGN_UP_FAILED, SIGN_UP, SIGN_UP_SUCCESS,
    SIGN_OUT, SIGN_OUT_SUCCESS, SIGN_OUT_FAILED,
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
} from "@/constants"

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

export const roleOnChange = createAction(ROLE_ONCHANGE, role => {
    return {
        role,
    }
})

export const signInRequest = createAction(SIGN_IN, (email, password) => {
    return {
        email,
        password,
    }
})

export const signInSucces = createAction(SIGN_IN_SUCCESS, response => {
    return {
        response,
    }
})

export const signInFailed = createAction(SIGN_IN_FAILED, error => {
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
    return {
        error,
    }
})

export const signUpRequest = createAction(SIGN_UP, (email, password) => {
    return {
        email,
        password,
    }
})

export const signOutRequest = createAction(SIGN_OUT)
export const signOutSuccess = createAction(SIGN_OUT_SUCCESS)
export const signOutFailed = createAction(SIGN_OUT_FAILED)
export const checkAuthRequest = createAction(CHECK_AUTH)
export const checkAuthSuccess = createAction(CHECK_AUTH_SUCCESS, response => {
    return {
        id: parseJwt(response.data.accessToken)
    }
})
export const checkAuthFailed = createAction(CHECK_AUTH_FAILED)