import { call, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import { profileAPI } from '@/api'
import {
    getProfileById,
    getProfileByIdFailed,
    getProfileByIdSuccess,
    updateProfile,
    updateProfileFailed,
    updateProfileSuccess,
} from '@/actions'
import { profileMutationGraphQL } from '@/graphQL/mutation'

function* getProfileByAccessTokenSaga({ payload }) {
    try {
        const response = yield call(profileAPI.getProfileById)
        console.log(response)

        yield put(getProfileByIdSuccess(response.data.userHttp))
    } catch (e) {
        yield put(getProfileByIdFailed(e.message))
    }
}

function* updateProfileSaga({ payload }) {
    try {
        const { profile, role } = payload
        const response = yield call(profileMutationGraphQL.updateProfile, { input: profile }, role)
        console.log(response)

        yield put(updateProfileSuccess(response))
        notification.success({ message: 'Успешно обновлено!' })
    } catch (e) {
        yield put(updateProfileFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

export function* profileSaga() {
    yield takeLatest(getProfileById, getProfileByAccessTokenSaga)
    yield takeLatest(updateProfile, updateProfileSaga)
}