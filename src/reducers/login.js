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
    signInRequest, signUpRequest,
    clearLoginState,
} from '@/actions'

const INITIAL_STATE = {
    user: {
        id: '',
        email: '',
        password: '',
        nickname: '',
        lastname: '',
        firstname: '',
        middlename: '',
    },
    signInRole: {},
    signUpRole: {},
    userRole: null,
    isAuth: false,
    loading: false,
}

export default handleActions({
    [emailOnChange](state, action) {
        return { ...state, user: { ...state.user, email: action.payload.email } }
    },
    [passwordOnChange](state, action) {
        return { ...state, user: { ...state.user, password: action.payload.password } }
    },
    [signInRoleOnChange](state, action) {
        return { ...state, signInRole: action.payload.role }
    },
    [signUpRoleOnChange](state, action) {
        return { ...state, signUpRole: action.payload.role }
    },
    [nicknameOnChange](state, action) {
        return { ...state, user: { ...state.user, nickname: action.payload.nickname } }
    },
    [lastnameOnChange](state, action) {
        return { ...state, user: { ...state.user, lastname: action.payload.lastname } }
    },
    [firstnameOnChange](state, action) {
        return { ...state, user: { ...state.user, firstname: action.payload.firstname } }
    },
    [middlenameOnChange](state, action) {
        return { ...state, user: { ...state.user, middlename: action.payload.middlename } }
    },
    [signInRequest](state, action) {
        return { ...state, loading: true }
    },
    [signInSucces](state, action) {
        return { ...state, isAuth: true, loading: false }
    },
    [signInFailed](state, action) {
        return { ...state, isAuth: false, loading: false }
    },
    [signUpRequest](state, action) {
        return { ...state, loading: true }
    },
    [signUpSuccess](state) {
        return { ...state, isAuth: true, loading: false }
    },
    [signUpFailed](state, action) {
        return { ...state, loading: false }
    },
    [signOutSuccess](state) {
        return { ...state, isAuth: false, loading: false }
    },
    [signOutFailed](state) {
        return { ...state, loading: false }
    },
    [checkAuthSuccess](state, action) {
        return {
            ...state, isAuth: true,
            user: { ...state.user, id: action.payload.id }, userRole: action.payload.role,
            loading: false,
        }
    },
    [checkAuthFailed](state, action) {
        return { ...state, isAuth: false, loading: false }
    },
    [clearLoginState](state) {
        return {
            ...state, user: {
                id: '',
                email: '',
                password: '',
                nickname: '',
                lastname: '',
                firstname: '',
                middlename: '',
            }, signInRole: {}, signUpRole: {}, loading: false,
        }
    },
}, INITIAL_STATE)

export const getLoginState = state => state
export const getIsAuth = state => state.isAuth
