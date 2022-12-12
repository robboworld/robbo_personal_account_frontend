import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import { DELETE_PROFILE, GET_PROFILE_BY_ID, UPDATE_PROFILE } from '@/constants/sagas/profile'
import {
    CLEAR_PROFILE_STATE, DELETE_ACCOUNT_FAILED,
    DELETE_ACCOUNT_SUCCESS, GET_PROFILE_BY_ID_FAILED,
    GET_PROFILE_BY_ID_SUCCESS, UPDATE_PROFILE_FAILED,
    UPDATE_PROFILE_SUCCESS,
} from '@/constants/reducers/profile'

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

export const updateProfile = createAction(UPDATE_PROFILE, (profile, role) => ({ profile, role }))

export const updateProfileSuccess = createAction(UPDATE_PROFILE_SUCCESS, response => {
    toast.success('Профиль успешно обновлен!')
    return {
        response,
    }
})

export const updateProfileFailed = createAction(UPDATE_PROFILE_FAILED, err => {
    toast.error('Ошибка при обновлении.')
    return {
        err,
    }
})
