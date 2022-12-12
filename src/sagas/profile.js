import { call, put, takeLatest } from 'redux-saga/effects'

import { profileAPI } from '@/api'
import {
    deleteProfile, deleteProfileFailed, deleteProfileSuccess,
    getProfileById, getProfileByIdFailed, getProfileByIdSuccess,
    updateProfile, updateProfileFailed, updateProfileSuccess,
} from '@/actions'
import { usersMutationGraphQL } from '@/graphQL/mutation'

function* getProfileByIdSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(profileAPI.getProfileById, token)
        console.log(response)

        yield put(getProfileByIdSuccess(response.data.userHttp))
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

function* updateProfileSaga({ payload }) {
    try {
        const { profile, role } = payload
        const response = yield call(usersMutationGraphQL.updateProfile, { input: profile }, role)
        console.log(response)

        yield put(updateProfileSuccess(response))
    } catch (e) {
        yield put(updateProfileFailed(e))
    }
}

export function* profileSaga() {
    yield takeLatest(getProfileById, getProfileByIdSaga)
    yield takeLatest(deleteProfile, deleteProfileSaga)
    yield takeLatest(updateProfile, updateProfileSaga)
}