import { call, takeLatest, put } from 'redux-saga/effects'
import { notification } from 'antd'

import { teachersAPI } from '@/api'
import {
    createTeacher,
    createTeacherFailed,
    createTeacherSuccess,
    deleteTeacher,
    deleteTeacherFailed,
    deleteTeacherSuccess,
    getTeachers,
    getTeachersFailed,
    getTeachersSuccess,
    deleteTeacherForRobboGroupFailed,
    deleteTeacherForRobboGroupRequest,
    deleteTeacherForRobboGroupSuccess,
    setTeacherForRobboGroupFailed,
    setTeacherForRobboGroupRequest,
    setTeacherForRobboGroupSuccess,
} from '@/actions'
import { teacherMutationsGraphQL, teacherQuerysGraphQL } from '@/graphQL'

function* getTeachersSaga(action) {
    try {
        const { page, pageZie } = action.payload
        const response = yield call(teacherQuerysGraphQL.GetAllTeachers, "1", "10")
        console.log(response)

        yield put(getTeachersSuccess(response.data.GetAllTeachers.teachers))
    } catch (e) {
        yield put(getTeachersFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteTeacherSaga(action) {
    try {
        const { teacherId, teacherIndex } = action.payload
        const response = yield call(teacherMutationsGraphQL.DeleteTeacher, teacherId)
        console.log(response)

        yield put(deleteTeacherSuccess(response.data.DeleteTeacher, teacherIndex))
        notification.success({ message: '', description: 'Педагог успешно удален!' })
    } catch (e) {
        yield put(deleteTeacherFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createTeacherSaga(action) {
    try {
        const { teacher } = action.payload
        const response = yield call(teacherMutationsGraphQL.CreateTeacher, { input: teacher })
        console.log(response)

        yield put(createTeacherSuccess(response.data.CreateTeacher))
        notification.success({ message: '', description: 'Педагог успешно создан!' })
    } catch (e) {
        yield put(createTeacherFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* setTeacherForRobboGroupSaga(action) {
    try {
        const { teacherId, robboGroupId } = action.payload
        const response = yield call(teacherMutationsGraphQL.SetTeacherForRobboGroup, teacherId, robboGroupId)
        console.log(response)

        yield put(setTeacherForRobboGroupSuccess(response.data.SetTeacherForRobboGroup))
        notification.success({ message: '', description: 'Педагог успешно назначен!' })
    } catch (e) {
        yield put(setTeacherForRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteTeacherForRobboGroupSaga(action) {
    try {
        const { teacherId, robboGroupId } = action.payload
        const response = yield call(teacherMutationsGraphQL.DeleteTeacherForRobboGroup, teacherId, robboGroupId)
        console.log(response)

        yield put(deleteTeacherForRobboGroupSuccess(response.data.DeleteTeacherForRobboGroup))
        notification.success({ message: '', description: 'Педагог успешно отстранен!' })
    } catch (e) {
        yield put(deleteTeacherForRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

export function* teachersSaga() {
    yield takeLatest(getTeachers, getTeachersSaga)
    yield takeLatest(deleteTeacher, deleteTeacherSaga)
    yield takeLatest(createTeacher, createTeacherSaga)
    yield takeLatest(setTeacherForRobboGroupRequest, setTeacherForRobboGroupSaga)
    yield takeLatest(deleteTeacherForRobboGroupRequest, deleteTeacherForRobboGroupSaga)
}