import { call, takeLatest, put } from 'redux-saga/effects'

import { robboUnitsAPI } from '@/api'
import { robboUnitMutationsGraphQL, robboUnitQuerysGraphQL } from '@/graphQL'
import {
    getRobboUnitsFailed,
    getRobboUnitsSuccess,
    deleteRobboUnitSuccess,
    deleteRobboUnitFailed,
    createRobboUnitSuccess,
    createRobboUnitFailed,
    deleteRobboUnitRequest,
    getRobboUnitByIdSuccess,
    getRobboUnitByIdFailed,
    updateRobboUnitSuccess,
    updateRobboUnitFailed,
    getRobboUnitsByUnitAdminIdSuccess,
    getRobboUnitsByUnitAdminIdFailed,
    getRobboUnitsByUnitAdminIdRequest,
    getRobboUnitsRequest,
    createRobboUnitRequest,
    getRobboUnitByIdRequest,
    updateRobboUnitRequest,
} from '@/actions'


function* getAllRobboUnitsSaga({ payload }) {
    try {
        const { page, pageSize } = payload
        const response = yield call(robboUnitQuerysGraphQL.getAllRobboUnits, "1", "10")
        console.log(response)

        yield put(getRobboUnitsSuccess(response.data.GetAllRobboUnits.robboUnits))
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

function* deleteRobboUnitSaga({ payload }) {
    try {
        const { robboUnitId, robboUnitIndex } = payload
        console.log(robboUnitId)
        const response = yield call(robboUnitMutationsGraphQL.deleteRobboUnit, { robboUnitId })
        console.log(response)

        yield put(deleteRobboUnitSuccess(response.data.DeleteRobboUnit, robboUnitIndex))
    } catch (e) {
        yield put(deleteRobboUnitFailed(e))
    }
}

function* createRobboUnitSaga(action) {
    try {
        const { robboUnit } = action.payload
        const response = yield call(robboUnitMutationsGraphQL.createRobboUnit, { input: robboUnit })
        console.log(response)

        yield put(createRobboUnitSuccess(response.data.CreateRobboUnit))
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
    yield takeLatest(getRobboUnitsRequest, getAllRobboUnitsSaga)
    yield takeLatest(deleteRobboUnitRequest, deleteRobboUnitSaga)
    yield takeLatest(createRobboUnitRequest, createRobboUnitSaga)
    yield takeLatest(getRobboUnitByIdRequest, getRobboUnitByIdSaga)
    yield takeLatest(updateRobboUnitRequest, updateRobboUnitSaga)
    yield takeLatest(getRobboUnitsByUnitAdminIdRequest, getRobboUnitsByUnitAdminIdSaga)
}