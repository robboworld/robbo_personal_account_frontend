import { call, put, takeLatest } from 'redux-saga/effects'

import {
    createUnitAdmin, createUnitAdminFailed, createUnitAdminSuccess,
    deleteUnitAdmin, deleteUnitAdminFailed,
    deleteUnitAdminSuccess, getUnitAdmins, getUnitAdminsFailed,
    getUnitAdminsSuccess,
} from '@/actions'
import { unitAdminsAPI } from '@/api'

function* getUnitAdminsSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(unitAdminsAPI.getUnitAdmins, token)
        console.log(response)

        yield put(getUnitAdminsSuccess(response.data))
    } catch (e) {
        yield put(getUnitAdminsFailed(e.message))
    }
}

function* createUnitAdminSaga(action) {
    try {
        const { token, unitAdmin } = action.payload
        const response = yield call(unitAdminsAPI.createUnitAdmin, token, unitAdmin)
        console.log(response)

        yield put(createUnitAdminSuccess(response.data, unitAdmin))
    } catch (e) {
        yield put(createUnitAdminFailed(e))
    }
}

function* deleteUnitAdminSaga(action) {
    try {
        const { token, unitAdminId, unitAdminIndex } = action.payload
        const response = yield call(unitAdminsAPI.deleteUnitAdmin, token, unitAdminId)
        console.log(response)

        yield put(deleteUnitAdminSuccess(response.data, unitAdminIndex))
    } catch (e) {
        yield put(deleteUnitAdminFailed(e))
    }
}

export function* unitAdminsSaga() {
    yield takeLatest(createUnitAdmin, createUnitAdminSaga)
    yield takeLatest(getUnitAdmins, getUnitAdminsSaga)
    yield takeLatest(deleteUnitAdmin, deleteUnitAdminSaga)
    // yield takeLatest(checkAuthRequest, checkAuthSaga)
}