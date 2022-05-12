import { createAction } from "redux-actions"

import {
    EMAIL_ONCHANGE,
    PASSWORD_ONCHANGE,
    SING_IN_SUCCESS,
    SING_IN_FAILED,
    SING_UP_SUCCESS,
    SING_UP_FAILED,
    SING_IN,
    SING_UP
} from "@/constants";

export const emailOnChange = createAction(EMAIL_ONCHANGE, (email) => {
    return {
        email
    }
})

export const passwordOnChange = createAction(PASSWORD_ONCHANGE, (password) => {
    return {
        password
    }
})

export const signInSucces = createAction(SING_IN_SUCCESS, (token) => {
    return {
        token
    }
})

export const signInFailed = createAction(SING_IN_FAILED, (error) => {
    return {
        error
    }
})

export const signUpSuccess = createAction(SING_UP_SUCCESS)

export const signUpFailed = createAction(SING_UP_FAILED, (error) => {
    return {
        error
    }
})

export const signInRequest = createAction(SING_IN, (email, password) => {
    return {
        email,
        password
    }
});

export const signUpRequest = createAction(SING_UP, (email, password) => {
    return {
        email,
        password
    }
});