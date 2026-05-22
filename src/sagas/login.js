import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import { authAPI } from '@/api'
import {
    signInSucces, signInFailed, signUpSuccess,
    signUpFailed, signInRequest, signUpRequest,
    signOutRequest, signOutSuccess, signOutFailed,
    checkAuthRequest, checkAuthSuccess, checkAuthFailed,
} from '@/actions'
import { authMutationsGraphQL, graphQLClient } from '@/graphQL'
import { redirectToOidcStart } from '@/helpers/oidcSession'

function* signInSaga(action) {
    try {
        const { email, password, role } = action.payload
        const response = yield call(authMutationsGraphQL.SingIn, email, password, role)
        console.log(response)
        localStorage.setItem('token', response.data.SingIn.accessToken)
        yield put(signInSucces(response.data.SingIn))
    } catch (e) {
        console.log(e.response)
        const errText = String(e?.response?.data?.error || e?.response?.data || '')
        if (errText.includes('legacy sign-in disabled') && !errText.includes('sign-up disabled')) {
            redirectToOidcStart('/home', 'login')
            return
        }
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
        const errorData = e?.response?.data
        const errorText = typeof errorData === 'string' ? errorData : e?.message
        const duplicatedEmailError =
            typeof errorText === 'string' &&
            (errorText.toLowerCase().includes('email is already used') ||
                errorText.toLowerCase().includes('user already exist'))

        notification.error({
            message: 'Ошибка',
            description: duplicatedEmailError
                ? 'Пользователь с таким email уже зарегистрирован'
                : (errorText || 'Не удалось выполнить регистрацию'),
        })

        yield put(signUpFailed(errorData))
    }
}

function* signOutSaga(action) {
    try {
        const response = yield call(authAPI.signOut)
        graphQLClient.resetStore()
        console.log(response)
        yield put(signOutSuccess())
        localStorage.removeItem('token')
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