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
    loading: false,
}

export default handleActions({
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
    [signOutRequest](state) {
        return { ...state, loading: true }
    },
    [signOutSuccess](state) {
        return { ...state, isAuth: false, loading: false }
    },
    [signOutFailed](state) {
        return { ...state, loading: false }
    },
    [checkAuthRequest](state) {
        return { ...state, loading: true }
    },
    [checkAuthSuccess](state, action) {
        console.log(1)
        return { ...state, isAuth: true, loading: false, userRole: action.payload.role }
    },
    [checkAuthFailed](state, action) {
        return { ...state, isAuth: false, loading: false }
    },
    [clearLoginState](state) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getLoginState = state => state
