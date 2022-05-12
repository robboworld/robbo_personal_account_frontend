import { call, put, take, takeLatest } from 'redux-saga/effects';
import { authAPI } from '@/api';
import {
    signInSucces,
    signInFailed,
    signUpSuccess,
    signUpFailed,
    signInRequest,
    signUpRequest
} from '@/actions'

function* signInSaga(action) {
    try {
        const email = action.payload.email;
        const password = action.payload.password;
        const response = yield call(authAPI.signIn, email, password);
        yield put(signInSucces(response));
    } catch (e) {
        yield put(signInFailed(e.message));
    }
}

function* signUpSaga(action) {
    try {
        const email = action.payload.email;
        const password = action.payload.password;
        const response = yield call(authAPI.signUp, email, password);
        yield put(signUpSuccess());
    } catch (e) {
        yield put(signUpFailed(e.message));
    }
}

export function* loginSaga() {
    yield takeLatest(signInRequest, signInSaga);
    yield takeLatest(signUpRequest, signUpSaga)
}