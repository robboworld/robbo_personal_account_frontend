import { call, takeLatest, put } from 'redux-saga/effects'

import { teachersAPI } from '@/api'
import {
    createTeacher, createTeacherFailed,
    createTeacherSuccess, deleteTeacher,
    deleteTeacherFailed, deleteTeacherSuccess,
    getTeachers, getTeachersFailed,
    getTeachersSuccess, deleteTeacherForRobboGroupFailed,
    deleteTeacherForRobboGroupRequest, deleteTeacherForRobboGroupSuccess,
    setTeacherForRobboGroupFailed, setTeacherForRobboGroupRequest,
    setTeacherForRobboGroupSuccess,
} from '@/actions'

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

function* createTeacherSaga(action) {
    try {
        const { token, teacher } = action.payload
        const response = yield call(teachersAPI.createTeacher, token, teacher)
        console.log(response)

        yield put(createTeacherSuccess(response.data, teacher))
    } catch (e) {
        yield put(createTeacherFailed(e))
    }
}

function* setTeacherForRobboGroupSaga(action) {
    try {
        const { token, teacherId, robboGroupId } = action.payload
        const response = yield call(teachersAPI.setTeacherForRobboGroup, token, teacherId, robboGroupId)
        console.log(response)

        yield put(setTeacherForRobboGroupSuccess(response.data))
    } catch (e) {
        yield put(setTeacherForRobboGroupFailed(e))
    }
}

function* deleteTeacherForRobboGroupSaga(action) {
    try {
        const { token, teacherId, robboGroupId } = action.payload
        const response = yield call(teachersAPI.deleteTeacherForRobboGroup, token, teacherId, robboGroupId)
        console.log(response)

        yield put(deleteTeacherForRobboGroupSuccess(response.data))
    } catch (e) {
        yield put(deleteTeacherForRobboGroupFailed(e))
    }
}

export function* teachersSaga() {
    yield takeLatest(getTeachers, getTeachersSaga)
    yield takeLatest(deleteTeacher, deleteTeacherSaga)
    yield takeLatest(createTeacher, createTeacherSaga)
    yield takeLatest(setTeacherForRobboGroupRequest, setTeacherForRobboGroupSaga)
    yield takeLatest(deleteTeacherForRobboGroupRequest, deleteTeacherForRobboGroupSaga)
}