import { call, put, takeLatest } from 'redux-saga/effects'

import { profileAPI } from '@/api'
import { deleteProfile, deleteProfileFailed, deleteProfileSuccess, getProfileById, getProfileByIdFailed, getProfileByIdSuccess } from '@/actions'

function* getProfileByIdSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(profileAPI.getProfileById, token)
        console.log(response)

        yield put(getProfileByIdSuccess(response.data))
    } catch (e) {
        yield put(getProfileByIdFailed(e.message))
    }
}

function* deleteProfileSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(profileAPI.deleteAccount, token)
        console.log(response)

        yield put(deleteProfileSuccess(response))
    } catch (e) {
        yield put(deleteProfileFailed(e))
    }
}

export function* profileSaga() {
    yield takeLatest(getProfileById, getProfileByIdSaga)
    yield takeLatest(deleteProfile, deleteProfileSaga)
}