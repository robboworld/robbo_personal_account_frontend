import { handleActions } from "redux-actions";

import {
    emailOnChange,
    passwordOnChange,
    signInSucces,
    signInFailed,
    signUpSuccess,
    signUpFailed
} from "@/actions";

const INITIAL_STATE = {
    id: '',
    email: '',
    password: '',
    token: '',
    signInError: '',
    signUpError: '',
    successInResponse: false,
    successUpResponse: false,
    isAuth: false,
}

export default handleActions({
    [emailOnChange](state, action) {
        return { ...state, email: action.payload.email }
    },
    [passwordOnChange](state, action) {
        return { ...state, password: action.payload.password }
    },
    [signInSucces](state, action) {
        return { ...state, token: action.payload.token.data, isAuth: true, successInResponse: true }
    },
    [signInFailed](state, action) {
        return { ...state, signInError: action.payload.error, isAuth: false, successInResponse: false }
    },
    [signUpSuccess](state) {
        return { ...state, email: '', password: '', successUpResponse: true }
    },
    [signUpFailed](state, action) {
        return { ...state, signUpError: action.payload.error, isAuth: false, successUpResponse: false }
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
