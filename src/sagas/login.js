import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { authAPI } from '@/api'
import {
    signInSucces, signInFailed, signUpSuccess,
    signUpFailed, signInRequest, signUpRequest,
    signOutRequest, signOutSuccess, signOutFailed,
    checkAuthRequest, checkAuthSuccess, checkAuthFailed,
} from '@/actions'
import { graphQLClient } from '@/graphQL'

function* signInSaga(action) {
    try {
        const { email, password, role } = action.payload
        const response = yield call(authAPI.signIn, email, password, role)
        console.log(response)
        localStorage.setItem('token', response.data.accessToken)
        console.log(response.headers)
        yield put(signInSucces(response))
    } catch (e) {
        console.log(e.response)
        yield put(signInFailed(e.response.data))
    }
}

function* signUpSaga(action) {
    try {
        const { user, role } = action.payload
        const response = yield call(authAPI.signUp, user, role)
        console.log(response)
        localStorage.setItem('token', response.data.accessToken)
        yield put(signUpSuccess(response))
    } catch (e) {
        console.log(e.response)
        yield put(signUpFailed(e.response.data))
    }
}

function* signOutSaga(action) {
    try {
        localStorage.removeItem('token')
        const response = yield call(authAPI.signOut)
        graphQLClient.resetStore()
        console.log(response)
        yield put(signOutSuccess())
    } catch (e) {
        console.log(e.response)
        yield put(signOutFailed(e.message))
    }
}

function* checkAuthSaga(action) {
    try {
        const { token } = action.payload.token
        const response = yield call(authAPI.checkAuth, token)
        console.log(response)
        yield put(checkAuthSuccess(response))
    } catch (e) {
        console.log(e.response)
        yield put(checkAuthFailed(e?.message))
    }
}

export function* loginWather() {
    yield takeLatest(signInRequest, signInSaga)
    yield takeLatest(signUpRequest, signUpSaga)
    yield takeEvery(signOutRequest, signOutSaga)
    yield takeLatest(checkAuthRequest, checkAuthSaga)
}