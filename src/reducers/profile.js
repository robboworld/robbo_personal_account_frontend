import { handleActions } from 'redux-actions'

import {
    clearProfileState, deleteProfile, deleteProfileFailed,
    deleteProfileSuccess, getProfileById, getProfileByIdFailed,
    getProfileByIdSuccess, updateProfile, updateProfileFailed, updateProfileSuccess,
} from '@/actions/profile'

const INITIAL_STATE = {
    profile: {},
    loading: true,
}

export default handleActions({

    [clearProfileState](state) {
        return INITIAL_STATE
    },
    [getProfileById](state) {
        return { ...state, loading: true }
    },
    [getProfileByIdSuccess](state, action) {
        return {
            ...state, loading: false, profile: action.payload.response,
        }
    },
    [getProfileByIdFailed](state, action) {
        return { ...state, loading: false }
    },
    [deleteProfile](state) {
        return { ...state, loading: true }
    },
    [deleteProfileSuccess](state, action) {
        return { ...state, loading: false }
    },
    [deleteProfileFailed](state, action) {
        return { ...state, loading: false }
    },
    [updateProfile](state, action) {
        return { ...state, loading: true }
    },
    [updateProfileSuccess](state, action) {
        return { ...state, loading: false }
    },
    [updateProfileFailed](state, action) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getProfileState = state => state
export const getProfile = state => state.profile
export const getProfileLoading = state => state.loading