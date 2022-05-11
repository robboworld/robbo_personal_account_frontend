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
        const token = yield call(authAPI.signIn, email, password);
        console.log(token)
        yield put(signInSucces(token));
    } catch (e) {
        alert(e)
        yield put(signInFailed(e));
    }
}

function* signUpSaga(action) {
    try {
        const email = action.payload.email;
        const password = action.payload.password;
        const token = yield call(authAPI.signUp, email, password);
        console.log(token)
        yield put(signUpSucces(token));
    } catch (e) {
        alert(e)
        yield put(signUpFailed(e));
    }
}

export function* loginSaga() {
    yield takeLatest(signInRequest, signInSaga);
    yield takeLatest(signUpRequest, signUpSaga)
}