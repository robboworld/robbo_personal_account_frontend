import { handleActions } from 'redux-actions'

import {
    signInSucces, signInFailed,
    signUpSuccess, signUpFailed,
    signOutSuccess, signOutFailed,
    checkAuthSuccess, checkAuthFailed,
    signInRequest, signUpRequest,
    clearLoginState, signOutRequest, checkAuthRequest,
} from '@/actions'

const INITIAL_STATE = {
    userRole: null,
    isAuth: false,
    loginLoading: false,
    signUpLoading: false,
}

export default handleActions({
    [signInRequest](state, action) {
        return { ...state, loginLoading: true }
    },
    [signInSucces](state, action) {
        return { ...state, isAuth: true, loginLoading: false, userRole: action.payload.response.userRole }
    },
    [signInFailed](state, action) {
        return { ...state, isAuth: false, loginLoading: false }
    },
    [signUpRequest](state, action) {
        return { ...state, signUpLoading: true }
    },
    [signUpSuccess](state) {
        return { ...state, isAuth: true, signUpLoading: false }
    },
    [signUpFailed](state, action) {
        return { ...state, signUpLoading: false }
    },
    [signOutRequest](state) {
        return { ...state, loginLoading: true }
    },
    [signOutSuccess](state) {
        return { ...state, isAuth: false, loginLoading: false, userRole: null }
    },
    [signOutFailed](state) {
        return { ...state, loginLoading: false }
    },
    [checkAuthRequest](state) {
        return { ...state, loginLoading: true }
    },
    [checkAuthSuccess](state, action) {
        return { ...state, isAuth: true, loginLoading: false, userRole: action.payload.role }
    },
    [checkAuthFailed](state, action) {
        return { ...state, isAuth: false, loginLoading: false }
    },
    [clearLoginState](state) {
        return { ...state, loginLoading: true }
    },
}, INITIAL_STATE)

export const getLoginState = state => state
