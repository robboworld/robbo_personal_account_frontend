import { call, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import {
    createUnitAdmin,
    createUnitAdminFailed,
    createUnitAdminSuccess,
    deleteUnitAdmin,
    deleteUnitAdminFailed,
    deleteUnitAdminForRobboUnitFailed,
    deleteUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitSuccess,
    deleteUnitAdminSuccess,
    getUnitAdmins,
    getUnitAdminsByRobboUnitIdFailed,
    getUnitAdminsByRobboUnitIdRequest,
    getUnitAdminsByRobboUnitIdSuccess,
    getUnitAdminsFailed,
    getUnitAdminsSuccess,
    searchUnitAdminsByEmailFailed,
    searchUnitAdminsByEmailRequest,
    searchUnitAdminsByEmailSuccess,
    setNewUnitAdminForRobboUnitFailed,
    setNewUnitAdminForRobboUnitRequest,
    setNewUnitAdminForRobboUnitSuccess,
} from '@/actions'
import { unitAdminsAPI } from '@/api'
import { unitAdminMutationsGraphQL, unitAdminQuerysGraphQL } from '@/graphQL'

function* getUnitAdminsSaga(action) {
    try {
        const { page, pageSize } = action.payload
        const response = yield call(unitAdminQuerysGraphQL.GetAllUnitAdmins, page, pageSize)
        console.log(response)

        yield put(getUnitAdminsSuccess(response.data.GetAllUnitAdmins.unitAdmins))
    } catch (e) {
        yield put(getUnitAdminsFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createUnitAdminSaga(action) {
    try {
        const { unitAdmin } = action.payload
        const response = yield call(unitAdminMutationsGraphQL.CreateUnitAdmin, { input: unitAdmin })
        console.log(response)

        yield put(createUnitAdminSuccess(response.data.CreateUnitAdmin))
        notification.success({ message: '', description: 'Unit Admin успешно создан!' })
    } catch (e) {
        yield put(createUnitAdminFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteUnitAdminSaga(action) {
    try {
        const { unitAdminId, unitAdminIndex } = action.payload
        const response = yield call(unitAdminMutationsGraphQL.DeleteUnitAdmin, unitAdminId)
        console.log(response)

        yield put(deleteUnitAdminSuccess(response.data.DeleteUnitAdmin, unitAdminIndex))
        notification.success({ message: '', description: 'Unit Admin успешно удален!' })
    } catch (e) {
        yield put(deleteUnitAdminFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
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
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* setNewUnitAdminForRobboUnitSaga(action) {
    try {
        const { unitAdminId, robboUnitId } = action.payload
        console.log(action)
        const response = yield call(unitAdminMutationsGraphQL.SetNewUnitAdminForRobboUnit, unitAdminId, robboUnitId)
        console.log(response)

        yield put(setNewUnitAdminForRobboUnitSuccess(response.data.SetNewUnitAdminForRobboUnit))
        notification.success({ message: '', description: 'Unit Admin успешно назначен!' })
    } catch (e) {
        yield put(setNewUnitAdminForRobboUnitFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
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
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteUnitAdminForRobboUnitSaga(action) {
    try {
        const { token, unitAdminId, robboUnitId } = action.payload
        console.log(action)
        const response = yield call(unitAdminsAPI.deleteUnitAdminForRobboUnit, token, unitAdminId, robboUnitId)
        console.log(response)

        yield put(deleteUnitAdminForRobboUnitSuccess(response))
        notification.success({ message: '', description: 'Unit Admin успешно отстранен!' })
    } catch (e) {
        yield put(deleteUnitAdminForRobboUnitFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
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