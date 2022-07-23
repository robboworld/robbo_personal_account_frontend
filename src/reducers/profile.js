import { handleActions } from 'redux-actions'

import {
    clearProfileState, deleteProfile, deleteProfileFailed,
    deleteProfileSuccess, getProfileById, getProfileByIdFailed,
    getProfileByIdSuccess, profileEmailOnChange, profileFirstnameOnChange,
    profileLastnameOnChange, profileMiddlenameOnChange, profileNicknameOnChange,
} from '@/actions/profile'

const INITIAL_STATE = {
    id: null,
    email: 'rupychman@mail.ru',
    nickname: 'skinnykaen',
    joinedAt: "10.05.2022",
    avatar: null,
    role: 'Ученик',
    firstname: 'Евгений',
    lastname: 'Сущевич',
    middlename: 'Павлович',
    aboutMe: "",
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
        return { ...state, loading: false }
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