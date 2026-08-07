import { createAction } from 'redux-actions'

import {
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILED,
    SIGN_IN,
    SIGN_UP_FAILED,
    SIGN_UP,
    SIGN_UP_SUCCESS,
    SIGN_OUT,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILED,
    CHECK_AUTH,
    CHECK_AUTH_SUCCESS,
    CHECK_AUTH_FAILED,
    CLEAR_LOGIN_STATE,
    SET_LOGIN_STREAK,
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
    return {
        error,
    }
})

export const signUpRequest = createAction(SIGN_UP, ({ user, role }) => {
    return {
        user,
        role,
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
    const data = response?.data || {}
    const streak = data.loginStreak || {}
    return {
        id: data.id,
        role: data.role,
        loginStreak: {
            current: Number(streak.current) || 0,
            longest: Number(streak.longest) || 0,
        },
    }
})
export const checkAuthFailed = createAction(CHECK_AUTH_FAILED, error => {
    return {
        error,
    }
})

export const setLoginStreak = createAction(SET_LOGIN_STREAK, streak => ({
    current: Number(streak?.current) || 0,
    longest: Number(streak?.longest) || 0,
}))