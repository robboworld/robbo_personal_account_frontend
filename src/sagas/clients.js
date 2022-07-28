import { call, put, takeLatest } from 'redux-saga/effects'

import { getClients, getClientsFailed, getClientsSuccess } from '@/actions'
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

export function* clientsSaga() {
    yield takeLatest(getClients, getClientsSaga)

}