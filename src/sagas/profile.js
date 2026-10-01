import { call, put, select, takeLatest } from 'redux-saga/effects'
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
import { formatMessageId } from '@/helpers/intl'
import { profileMutationsGraphQL } from '@/graphQL/mutation'

function* getProfileByAccessTokenSaga({ payload }) {
    try {
        const response = yield call(profileAPI.getProfileById)

        yield put(getProfileByIdSuccess(response.data.userHttp))
    } catch (e) {
        yield put(getProfileByIdFailed(e.message))
    }
}

function* updateProfileSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { profile, role } = payload
        const response = yield call(profileMutationsGraphQL.UpdateProfile, { input: profile }, role)

        yield put(updateProfileSuccess(response))
        notification.success({
            title: formatMessageId(language, 'notification.profile_update_short'),
        })
    } catch (e) {
        yield put(updateProfileFailed(e))
        notification.error({
            title: formatMessageId(language, 'notification.error_message'),
            description: e.message,
        })
    }
}

export function* profileSaga() {
    yield takeLatest(getProfileById, getProfileByAccessTokenSaga)
    yield takeLatest(updateProfile, updateProfileSaga)
}
