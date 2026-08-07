import { handleActions } from 'redux-actions'

import {
    signInSucces, signInFailed,
    signUpSuccess, signUpFailed,
    signOutSuccess, signOutFailed,
    checkAuthSuccess, checkAuthFailed,
    signInRequest, signUpRequest,
    clearLoginState, signOutRequest, checkAuthRequest,
    setLoginStreak,
} from '@/actions'

const INITIAL_STATE = {
    userRole: null,
    userId: null,
    isAuth: false,
    loginLoading: false,
    signUpLoading: false,
    loginStreak: { current: 0, longest: 0 },
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
        return {
            ...state,
            isAuth: false,
            loginLoading: false,
            userRole: null,
            userId: null,
            loginStreak: { current: 0, longest: 0 },
        }
    },
    [signOutFailed](state) {
        return { ...state, loginLoading: false }
    },
    [checkAuthRequest](state) {
        return { ...state, loginLoading: true }
    },
    [checkAuthSuccess](state, action) {
        return {
            ...state,
            isAuth: true,
            loginLoading: false,
            userRole: action.payload.role,
            userId: action.payload.id || null,
            loginStreak: action.payload.loginStreak || { current: 0, longest: 0 },
        }
    },
    [checkAuthFailed](state, action) {
        return {
            ...state,
            isAuth: false,
            loginLoading: false,
            userId: null,
            loginStreak: { current: 0, longest: 0 },
        }
    },
    [clearLoginState](state) {
        return { ...state, loginLoading: true }
    },
    [setLoginStreak](state, action) {
        return {
            ...state,
            loginStreak: {
                current: Number(action.payload?.current) || 0,
                longest: Number(action.payload?.longest) || 0,
            },
        }
    },
}, INITIAL_STATE)

export const getLoginState = state => state
export const getLoginStreak = state => state.loginStreak || { current: 0, longest: 0 }
