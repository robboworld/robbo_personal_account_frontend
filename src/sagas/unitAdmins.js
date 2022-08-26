import { call, put, takeLatest } from 'redux-saga/effects'

import {
    createUnitAdmin, createUnitAdminFailed, createUnitAdminSuccess,
    deleteUnitAdmin, deleteUnitAdminFailed,
    deleteUnitAdminForRobboUnitFailed,
    deleteUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitSuccess,
    deleteUnitAdminSuccess, getUnitAdmins, getUnitAdminsByRobboUnitIdFailed, getUnitAdminsByRobboUnitIdRequest, getUnitAdminsByRobboUnitIdSuccess, getUnitAdminsFailed,
    getUnitAdminsSuccess,
    searchUnitAdminsByEmailFailed,
    searchUnitAdminsByEmailRequest,
    searchUnitAdminsByEmailSuccess,
    setNewUnitAdminForRobboUnitFailed,
    setNewUnitAdminForRobboUnitRequest,
    setNewUnitAdminForRobboUnitSuccess,
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

function* searchUnitAdminsByEmailSaga(action) {
    try {
        const { token, email } = action.payload
        const response = yield call(unitAdminsAPI.searchUnitAdminsByEmail, token, email)
        console.log(response)

        yield put(searchUnitAdminsByEmailSuccess(response.data))
    } catch (e) {
        yield put(searchUnitAdminsByEmailFailed(e))
    }
}

function* setNewUnitAdminForRobboUnitSaga(action) {
    try {
        const { token, unitAdminId, robboUnitId } = action.payload
        console.log(action)
        const response = yield call(unitAdminsAPI.setNewUnitAdminForRobboUnit, token, unitAdminId, robboUnitId)
        console.log(response)

        yield put(setNewUnitAdminForRobboUnitSuccess(response))
    } catch (e) {
        yield put(setNewUnitAdminForRobboUnitFailed(e))
    }
}

function* getUnitAdminsByRobboUnitIdSaga(action) {
    try {
        const { token, robboUnitId } = action.payload
        const response = yield call(unitAdminsAPI.getUnitAdminsByRobboUnitId, token, robboUnitId)
        console.log(response)

        yield put(getUnitAdminsByRobboUnitIdSuccess(response.data))
    } catch (e) {
        yield put(getUnitAdminsByRobboUnitIdFailed(e))
    }
}

function* deleteUnitAdminForRobboUnitSaga(action) {
    try {
        const { token, unitAdminId, robboUnitId } = action.payload
        console.log(action)
        const response = yield call(unitAdminsAPI.deleteUnitAdminForRobboUnit, token, unitAdminId, robboUnitId)
        console.log(response)

        yield put(deleteUnitAdminForRobboUnitSuccess(response))
    } catch (e) {
        yield put(deleteUnitAdminForRobboUnitFailed(e))
    }
}

export function* unitAdminsSaga() {
    yield takeLatest(createUnitAdmin, createUnitAdminSaga)
    yield takeLatest(getUnitAdmins, getUnitAdminsSaga)
    yield takeLatest(deleteUnitAdmin, deleteUnitAdminSaga)
    yield takeLatest(searchUnitAdminsByEmailRequest, searchUnitAdminsByEmailSaga)
    yield takeLatest(setNewUnitAdminForRobboUnitRequest, setNewUnitAdminForRobboUnitSaga)
    yield takeLatest(getUnitAdminsByRobboUnitIdRequest, getUnitAdminsByRobboUnitIdSaga)
    yield takeLatest(deleteUnitAdminForRobboUnitRequest, deleteUnitAdminForRobboUnitSaga)
}