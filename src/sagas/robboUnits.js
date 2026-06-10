import { call, takeLatest, put, select } from 'redux-saga/effects'

import { notification } from 'antd'

import { formatMessageId } from '@/helpers/intl'

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
    const language = yield select(state => state.app.language)
    try {
        const { page, pageSize } = payload
        const response = yield call(robboUnitQuerysGraphQL.GetAllRobboUnits, "1", "10")
        console.log(response)

        yield put(getRobboUnitsSuccess(response.data.GetAllRobboUnits.robboUnits))
    } catch (e) {
        yield put(getRobboUnitsFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getRobboUnitsByUnitAdminIdSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { page, pageSize } = payload
        const response = yield call(robboUnitQuerysGraphQL.GetRobboUnitsByAccessToken, page, pageSize)
        console.log(response)

        yield put(getRobboUnitsByUnitAdminIdSuccess(response.data.GetRobboUnitsByAccessToken))
    } catch (e) {
        yield put(getRobboUnitsByUnitAdminIdFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getRobboUnitByIdSaga(action) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnitId } = action.payload
        const response = yield call(robboUnitQuerysGraphQL.GetRobboUnitById, { robboUnitId })
        console.log(response)

        yield put(getRobboUnitByIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboUnitByIdFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* deleteRobboUnitSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnitId, robboUnitIndex } = payload
        const response = yield call(robboUnitMutationsGraphQL.DeleteRobboUnit, { robboUnitId })
        console.log(response)

        yield put(deleteRobboUnitSuccess(response.data.DeleteRobboUnit, robboUnitIndex))
        notification.success({ message: '', description: formatMessageId(language, 'notification.unit_delete_success') })
    } catch (e) {
        yield put(deleteRobboUnitFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createRobboUnitSaga(action) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnit } = action.payload
        const response = yield call(robboUnitMutationsGraphQL.CreateRobboUnit, { input: robboUnit })
        console.log(response)

        yield put(createRobboUnitSuccess(response.data.CreateRobboUnit))
        notification.success({ message: '', description: formatMessageId(language, 'notification.robbo_unit_create_success') })
    } catch (e) {
        yield put(createRobboUnitFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* updateRobboUnitSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnit } = payload
        const response = yield call(robboUnitMutationsGraphQL.UpdateRobboUnit, { input: robboUnit })
        console.log(response)

        yield put(updateRobboUnitSuccess(response.data.UpdateRobboUnit))
        notification.success({ message: '', description: formatMessageId(language, 'notification.unit_update_success') })
    } catch (e) {
        yield put(updateRobboUnitFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
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