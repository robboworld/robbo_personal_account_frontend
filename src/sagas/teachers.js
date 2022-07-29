import { call, takeLatest, put } from 'redux-saga/effects'

import { teachersAPI } from '@/api'
import { getTeachers, getTeachersFailed, getTeachersSuccess } from '@/actions/teachers'

function* getTeachersSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(teachersAPI.getTeachers, token)
        console.log(response)

        yield put(getTeachersSuccess(response.data))
    } catch (e) {
        yield put(getTeachersFailed(e.message))
    }
}


export function* teachersSaga() {
    yield takeLatest(getTeachers, getTeachersSaga)
}