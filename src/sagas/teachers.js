import { call, takeLatest, put } from 'redux-saga/effects'

import { teachersAPI } from '@/api'
import { deleteTeacher, deleteTeacherFailed, deleteTeacherSuccess, getTeachers, getTeachersFailed, getTeachersSuccess } from '@/actions/teachers'

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

function* deleteTeacherSaga(action) {
    try {
        const { token, teacherId, teacherIndex } = action.payload
        const response = yield call(teachersAPI.deleteTeacher, token, teacherId)
        console.log(response)

        yield put(deleteTeacherSuccess(response.data, teacherIndex))
    } catch (e) {
        yield put(deleteTeacherFailed(e))
    }
}

export function* teachersSaga() {
    yield takeLatest(getTeachers, getTeachersSaga)
    yield takeLatest(deleteTeacher, deleteTeacherSaga)
}