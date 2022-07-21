import { call, put, takeLatest } from 'redux-saga/effects'

import { teachersAPI } from '@/api'
import { getTeachers } from '@/actions/teachers'

function* getTeachersSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(teachersAPI.getTeachers, token)
        console.log(response)

        // yield put(getProfileByIdSuccess(response.data))
    } catch (e) {
        // yield put(getProfileByIdFailed(e.message))
    }
}


export function* teachersSaga() {
    yield takeLatest(getTeachers, getTeachersSaga)
}