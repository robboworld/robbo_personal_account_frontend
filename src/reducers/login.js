import { handleActions } from 'redux-actions'

import {
    emailOnChange,
    passwordOnChange,
    roleOnChange,
    signInSucces, signInFailed,
    signUpSuccess, signUpFailed,
    signOutSuccess, signOutFailed,
    checkAuthSuccess, checkAuthFailed,
} from '@/actions'

const INITIAL_STATE = {
    roles: [
        { value: 0, label: 'Ученик' },
        { value: 1, label: 'Учитель' },
        { value: 2, label: 'Родитель' },
        { value: 3, label: 'Свободный слушатель' },
        // { value: 'admin', label: ' Администратор' },
    ],
    id: '',
    email: '',
    password: '',
    role: {},
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
    [roleOnChange](state, action) {
        return { ...state, role: action.payload.role }
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
export const getId = state => state.id
export const getEmail = state => state.email
export const getPassword = state => state.password
export const getRoles = state => state.roles
export const getRole = state => state.role
export const getUserRole = state => state.userRole
export const getToken = state => state.token
export const getIsAuth = state => state.isAuth
