import { handleActions } from 'redux-actions'

import {
    clearProfileState, deleteProfile, deleteProfileFailed,
    deleteProfileSuccess, getProfileById, getProfileByIdFailed,
    getProfileByIdSuccess, profileEmailOnChange, profileFirstnameOnChange,
    profileLastnameOnChange, profileMiddlenameOnChange, profileNicknameOnChange, updateProfile, updateProfileFailed, updateProfileSuccess,
} from '@/actions/profile'

const INITIAL_STATE = {
    profile: {},
    loading: false,
}

export default handleActions({
    [profileEmailOnChange](state, action) {
        return { ...state, profile: { ...state.profile, email: action.payload.email } }
    },
    [profileNicknameOnChange](state, action) {
        return { ...state, profile: { ...state.profile, nickname: action.payload.nickname } }
    },
    [profileLastnameOnChange](state, action) {
        return { ...state, profile: { ...state.profile, lastname: action.payload.lastname } }
    },
    [profileFirstnameOnChange](state, action) {
        return { ...state, profile: { ...state.profile, firstname: action.payload.firstname } }
    },
    [profileMiddlenameOnChange](state, action) {
        return { ...state, profile: { ...state.profile, middlename: action.payload.middlename } }
    },
    [clearProfileState](state) {
        return { ...state, profile: {}, loading: false }
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