import { call, put, take, takeLatest } from 'redux-saga/effects';
import { authAPI } from '@/api';
import {
    signInSucces,
    signInFailed,
    signUpSuccess,
    signUpFailed,
    signInRequest,
    signUpRequest,
    signOutRequest,
    signOutSuccess,
    signOutFailed
} from '@/actions'

function* signInSaga(action) {
    try {
        const email = action.payload.email;
        const password = action.payload.password;
        const response = yield call(authAPI.signIn, email, password);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuth', 'true');
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
        localStorage.setItem('isAuth', 'false');
        yield put(signUpFailed(e.message));
    }
}

function* signOutSaga(action) {
    try {
        const response = yield call(authAPI.signOut);
        localStorage.setItem('token', '');
        localStorage.setItem('isAuth', 'false');
        yield put(signOutSuccess());
    } catch (e) {
        alert(e)
        yield put(signOutFailed(e.message));
    }
}

export function* loginSaga() {
    yield takeLatest(signInRequest, signInSaga);
    yield takeLatest(signUpRequest, signUpSaga);
    yield takeLatest(signOutRequest, signOutSaga);
}