import { createAction } from 'redux-actions'

import { DELETE_PROFILE, GET_PROFILE_BY_ID } from '@/constants/sagas/profile'
import { CLEAR_PROFILE_STATE, DELETE_ACCOUNT_FAILED, DELETE_ACCOUNT_SUCCESS, GET_PROFILE_BY_ID_FAILED, GET_PROFILE_BY_ID_SUCCESS, PROFILE_EMAIL_ONCHANGE, PROFILE_FIRSTNAME_ONCHANGE, PROFILE_LASTNAME_ONCHANGE, PROFILE_MIDDLENAME_ONCHANGE, PROFILE_NICKNAME_ONCHANGE } from '@/constants/reducers/profile'

export const getProfileById = createAction(GET_PROFILE_BY_ID, token => {
    return {
        token,
    }
})

export const getProfileByIdSuccess = createAction(GET_PROFILE_BY_ID_SUCCESS, response => {
    return {
        response,
    }
})


export const getProfileByIdFailed = createAction(GET_PROFILE_BY_ID_FAILED, err => {
    return {
        err,
    }
})

export const profileEmailOnChange = createAction(PROFILE_EMAIL_ONCHANGE, email => {
    return {
        email,
    }
})

export const clearProfileState = createAction(CLEAR_PROFILE_STATE)

export const deleteProfile = createAction(DELETE_PROFILE, token => {
    return {
        token,
    }
})

export const deleteProfileSuccess = createAction(DELETE_ACCOUNT_SUCCESS, response => {
    return {
        response,
    }
})

export const deleteProfileFailed = createAction(DELETE_ACCOUNT_FAILED, err => {
    return {
        err,
    }
})

export const profileNicknameOnChange = createAction(PROFILE_NICKNAME_ONCHANGE, nickname => {
    return {
        nickname,
    }
})

export const profileLastnameOnChange = createAction(PROFILE_LASTNAME_ONCHANGE, lastname => {
    return {
        lastname,
    }
})

export const profileFirstnameOnChange = createAction(PROFILE_FIRSTNAME_ONCHANGE, firstname => {
    return {
        firstname,
    }
})

export const profileMiddlenameOnChange = createAction(PROFILE_MIDDLENAME_ONCHANGE, middlename => {
    return {
        middlename,
    }
})