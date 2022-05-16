import { handleActions } from "redux-actions";

import {
    emailOnChange,
    passwordOnChange,
    signInSucces,
    signInFailed,
    signUpSuccess,
    signUpFailed,
    signOutSuccess,
    signOutFailed,
} from "@/actions";

const INITIAL_STATE = {
    id: '',
    email: '',
    password: '',
    signInError: '',
    signUpError: '',
    successInResponse: false,
    successUpResponse: false,
}

export default handleActions({
    [emailOnChange](state, action) {
        return { ...state, email: action.payload.email }
    },
    [passwordOnChange](state, action) {
        return { ...state, password: action.payload.password }
    },
    [signInSucces](state, action) {
        return { ...state, successInResponse: true }
    },
    [signInFailed](state, action) {
        return { ...state, signInError: action.payload.error, successInResponse: false }
    },
    [signUpSuccess](state) {
        return { ...state, email: '', password: '', successUpResponse: true }
    },
    [signUpFailed](state, action) {
        return { ...state, signUpError: action.payload.error, successUpResponse: false }
    },
    [signOutSuccess](state) {
        return { ...state, email: '', passord: '', }
    },
    [signOutFailed](state) {
        return { ...state }
    },
}, INITIAL_STATE);

export const getId = state => state.id;
export const getEmail = state => state.email;
export const getPassword = state => state.password;
export const getToken = state => state.token;
export const getSignInError = state => state.signInError;
export const getSignUpError = state => state.signUpError;
export const getIsAuth = state => state.isAuth;
export const getSuccessInResponse = state => state.successInResponse;
export const getSuccessUpResponse = state => state.successUpResponse;
