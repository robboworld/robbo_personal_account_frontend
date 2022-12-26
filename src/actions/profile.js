import { createAction } from 'redux-actions'

import {
    GET_PROFILE_BY_ID,
    UPDATE_PROFILE,
    CLEAR_PROFILE_STATE,
    GET_PROFILE_BY_ID_FAILED,
    GET_PROFILE_BY_ID_SUCCESS,
    UPDATE_PROFILE_FAILED,
    UPDATE_PROFILE_SUCCESS,
} from '@/constants'

export const getProfileById = createAction(GET_PROFILE_BY_ID)
export const getProfileByIdSuccess = createAction(GET_PROFILE_BY_ID_SUCCESS, response => ({ response }))
export const getProfileByIdFailed = createAction(GET_PROFILE_BY_ID_FAILED, err => err)

export const updateProfile = createAction(UPDATE_PROFILE, (profile, role) => ({ profile, role }))
export const updateProfileSuccess = createAction(UPDATE_PROFILE_SUCCESS, response => ({ response }))
export const updateProfileFailed = createAction(UPDATE_PROFILE_FAILED, err => ({ err }))

export const clearProfileState = createAction(CLEAR_PROFILE_STATE)