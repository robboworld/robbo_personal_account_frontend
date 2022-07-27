import { handleActions } from 'redux-actions'

import {
    clearProfileState, deleteProfile, deleteProfileFailed,
    deleteProfileSuccess, getProfileById, getProfileByIdFailed,
    getProfileByIdSuccess, profileEmailOnChange, profileFirstnameOnChange,
    profileLastnameOnChange, profileMiddlenameOnChange, profileNicknameOnChange,
} from '@/actions/profile'
import { UserRole } from '@/constants'

const INITIAL_STATE = {
    id: null,
    email: '',
    nickname: '',
    joinedAt: '',
    avatar: null,
    role: '',
    firstname: '',
    lastname: '',
    middlename: '',
    aboutMe: '',
    // workingOn: "",
    // informationTrail: "",
    loading: false,
}

export default handleActions({
    [profileEmailOnChange](state, action) {
        return { ...state, email: action.payload.email }
    },
    [profileNicknameOnChange](state, action) {
        return { ...state, nickname: action.payload.nickname }
    },
    [profileLastnameOnChange](state, action) {
        return { ...state, lastname: action.payload.lastname }
    },
    [profileFirstnameOnChange](state, action) {
        return { ...state, firstname: action.payload.firstname }
    },
    [profileMiddlenameOnChange](state, action) {
        return { ...state, middlename: action.payload.middlename }
    },
    [clearProfileState](state) {
        return { ...state, id: null, email: null, joinedAt: null, role: null, loading: false }
    },
    [getProfileById](state) {
        return { ...state, loading: true }
    },
    [getProfileByIdSuccess](state, action) {
        const { email, nickname, lastname, firstname, createdAt, role } = action.payload.response
        return {
            ...state, loading: false, email: email,
            nickname: nickname, firstname: firstname,
            lastname: lastname, joinedAt: createdAt, role: UserRole[role],
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
}, INITIAL_STATE)

export const getProfile = state => state
export const getProfileLoading = state => state.loading