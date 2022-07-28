import { handleActions } from 'redux-actions'

import {
    emailOnChange, passwordOnChange,
    signInSucces, signInFailed,
    signUpSuccess, signUpFailed,
    signOutSuccess, signOutFailed,
    checkAuthSuccess, checkAuthFailed,
    nicknameOnChange, lastnameOnChange,
    firstnameOnChange, middlenameOnChange,
    signInRoleOnChange, signUpRoleOnChange,
} from '@/actions'

const INITIAL_STATE = {
    id: '',
    email: '',
    password: '',
    nickname: '',
    lastname: '',
    firstname: '',
    middlename: '',
    signInRole: {},
    signUpRole: {},
    userRole: null,
    isAuth: false,
}

export default handleActions({
    [emailOnChange](state, action) {
        return { ...state, email: action.payload.email }
    },
    [passwordOnChange](state, action) {
        return { ...state, password: action.payload.password }
    },
    [signInRoleOnChange](state, action) {
        return { ...state, signInRole: action.payload.role }
    },
    [signUpRoleOnChange](state, action) {
        return { ...state, signUpRole: action.payload.role }
    },
    [nicknameOnChange](state, action) {
        return { ...state, nickname: action.payload.nickname }
    },
    [lastnameOnChange](state, action) {
        return { ...state, lastname: action.payload.lastname }
    },
    [firstnameOnChange](state, action) {
        return { ...state, firstname: action.payload.firstname }
    },
    [middlenameOnChange](state, action) {
        return { ...state, middlename: action.payload.middlename }
    },
    [signInSucces](state, action) {
        return { ...state, isAuth: true }
    },
    [signInFailed](state, action) {
        return { ...state, isAuth: false }
    },
    [signUpSuccess](state) {
        return { ...state, email: '', password: '', isAuth: true }
    },
    [signUpFailed](state, action) {
        return { ...state }
    },
    [signOutSuccess](state) {
        return { ...state, email: '', password: '', isAuth: false }
    },
    [signOutFailed](state) {
        return { ...state }
    },
    [checkAuthSuccess](state, action) {
        return { ...state, isAuth: true, id: action.payload.id, userRole: action.payload.role }
    },
    [checkAuthFailed](state, action) {
        return { ...state, isAuth: false }
    },
}, INITIAL_STATE)

export const getLoginState = state => state
export const getIsAuth = state => state.isAuth
