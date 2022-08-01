import { call, put, takeLatest } from 'redux-saga/effects'

import {
    addParentFailed, addParentSuccess,
    getClients, getClientsFailed,
    getClientsSuccess, addParent,
}
    from '@/actions'
import { clientsAPI } from '@/api'

function* getClientsSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(clientsAPI.getClients, token)
        console.log(response)

        yield put(getClientsSuccess(response.data))
    } catch (e) {
        yield put(getClientsFailed(e.message))
    }
}

function* addParentSaga(action) {
    try {
        const { token, parent } = action.payload
        const response = yield call(clientsAPI.addParent, token, parent)
        console.log(response)

        yield put(addParentSuccess(response.data, parent))
    } catch (e) {
        yield put(addParentFailed(e))
    }
}

export function* clientsSaga() {
    yield takeLatest(getClients, getClientsSaga)
    yield takeLatest(addParent, addParentSaga)
}