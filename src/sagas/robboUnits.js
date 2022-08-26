import { call, takeLatest, put } from 'redux-saga/effects'

import { robboUnitsAPI } from '@/api'
import {
    getRobboUnitsFailed,
    getRobboUnitsSuccess,
    deleteRobboUnitSuccess,
    deleteRobboUnitFailed,
    createRobboUnitSuccess,
    createRobboUnitFailed,
    getRobboUnits,
    deleteRobboUnitRequest,
    getRobboUnitById,
    createRobboUnit,
    getRobboUnitByIdSuccess,
    getRobboUnitByIdFailed,
    updateRobboUnit,
    updateRobboUnitSuccess,
    updateRobboUnitFailed,
    getRobboUnitsByUnitAdminIdSuccess,
    getRobboUnitsByUnitAdminIdFailed,
    getRobboUnitsByUnitAdminIdRequest,
} from '@/actions'


function* getRobboUnitsSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(robboUnitsAPI.getRobboUnits, token)
        console.log(response)

        yield put(getRobboUnitsSuccess(response.data))
    } catch (e) {
        yield put(getRobboUnitsFailed(e.message))
    }
}

function* getRobboUnitsByUnitAdminIdSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(robboUnitsAPI.getRobboUnitsByUnitAdminId, token)
        console.log(response)

        yield put(getRobboUnitsByUnitAdminIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboUnitsByUnitAdminIdFailed(e.message))
    }
}

function* getRobboUnitByIdSaga(action) {
    try {
        const { token, robboUnitId } = action.payload
        const response = yield call(robboUnitsAPI.getRobboUnitById, token, robboUnitId)
        console.log(response)

        yield put(getRobboUnitByIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboUnitByIdFailed(e.message))
    }
}

function* deleteRobboUnitSaga(action) {
    try {
        const { token, robboUnitId, robboUnitIndex } = action.payload
        const response = yield call(robboUnitsAPI.deleteRobboUnit, token, robboUnitId)
        console.log(response)

        yield put(deleteRobboUnitSuccess(response.data, robboUnitIndex))
    } catch (e) {
        yield put(deleteRobboUnitFailed(e))
    }
}

function* createRobboUnitSaga(action) {
    try {
        const { token, robboUnit } = action.payload
        const response = yield call(robboUnitsAPI.createRobboUnit, token, robboUnit)
        console.log(response)

        yield put(createRobboUnitSuccess(response.data, robboUnit))
    } catch (e) {
        yield put(createRobboUnitFailed(e))
    }
}

function* updateRobboUnitSaga(action) {
    try {
        const { token, robboUnit } = action.payload
        const response = yield call(robboUnitsAPI.updateRobboUnit, token, robboUnit)
        console.log(response)

        yield put(updateRobboUnitSuccess(response))
    } catch (e) {
        yield put(updateRobboUnitFailed(e))
    }
}

export function* robboUnitsSaga() {
    yield takeLatest(getRobboUnits, getRobboUnitsSaga)
    yield takeLatest(deleteRobboUnitRequest, deleteRobboUnitSaga)
    yield takeLatest(createRobboUnit, createRobboUnitSaga)
    yield takeLatest(getRobboUnitById, getRobboUnitByIdSaga)
    yield takeLatest(updateRobboUnit, updateRobboUnitSaga)
    yield takeLatest(getRobboUnitsByUnitAdminIdRequest, getRobboUnitsByUnitAdminIdSaga)
}