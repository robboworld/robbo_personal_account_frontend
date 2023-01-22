import { call, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import { coursePageMutationsGraphQL } from '@/graphQL'
import {
    createCourseAccessRelationRobboGroupFailed,
    createCourseAccessRelationRobboGroupRequest,
    createCourseAccessRelationRobboGroupSuccess,
    createCourseAccessRelationRobboUnitFailed,
    createCourseAccessRelationRobboUnitRequest,
    createCourseAccessRelationRobboUnitSuccess,
    createCourseAccessRelationStudentFailed,
    createCourseAccessRelationStudentRequest,
    createCourseAccessRelationStudentSuccess,
    createCourseAccessRelationTeacherFailed,
    createCourseAccessRelationTeacherRequest,
    createCourseAccessRelationTeacherSuccess,
    createCourseAccessRelationUnitAdminFailed,
    createCourseAccessRelationUnitAdminRequest,
    createCourseAccessRelationUnitAdminSuccess,
    deleteCourseAccessRelationStudentFailed,
    deleteCourseAccessRelationStudentRequest,
    deleteCourseAccessRelationStudentSuccess,
} from '@/actions'

function* createCourseAccessRelationStudentSaga({ payload }) {
    try {
        const { courseId, studentId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationStudent, { input: { courseId, studentId } })
        console.log(response)

        yield put(createCourseAccessRelationStudentSuccess(response.data.CreateAccessCourseRelationStudent))
        notification.success({ message: '', description: 'Доступ успешно добавлен!' })
    } catch (e) {
        yield put(createCourseAccessRelationStudentFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createCourseAccessRelationTeacherSaga({ payload }) {
    try {
        const { courseId, teacherId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationTeacher, { input: { courseId, teacherId } })
        console.log(response)

        yield put(createCourseAccessRelationTeacherSuccess(response.data.CreateAccessCourseRelationTeacher))
        notification.success({ message: '', description: 'Доступ успешно добавлен!' })
    } catch (e) {
        yield put(createCourseAccessRelationTeacherFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createCourseAccessRelationUnitAdminSaga({ payload }) {
    try {
        const { courseId, unitAdminId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationUnitAdmin, { input: { courseId, unitAdminId } })
        console.log(response)

        yield put(createCourseAccessRelationUnitAdminSuccess(response.data.CreateAccessCourseRelationUnitAdmin))
        notification.success({ message: '', description: 'Доступ успешно добавлен!' })
    } catch (e) {
        yield put(createCourseAccessRelationUnitAdminFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createCourseAccessRelationRobboUnitSaga({ payload }) {
    try {
        const { courseId, robboUnitId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationRobboUnit, { input: { courseId, robboUnitId } })
        console.log(response)

        yield put(createCourseAccessRelationRobboUnitSuccess(response.data.CreateAccessCourseRelationRobboUnit))
        notification.success({ message: '', description: 'Доступ успешно добавлен!' })
    } catch (e) {
        yield put(createCourseAccessRelationRobboUnitFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createCourseAccessRelationRobboGroupSaga({ payload }) {
    try {
        const { courseId, robboGroupId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationRobboGroup, { input: { courseId, robboGroupId } })
        console.log(response)

        yield put(createCourseAccessRelationRobboGroupSuccess(response.data.CreateAccessCourseRelationStudent))
        notification.success({ message: '', description: 'Доступ успешно добавлен!' })
    } catch (e) {
        yield put(createCourseAccessRelationRobboGroupFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteCourseAccessRelationStudentSaga({ payload }) {
    try {
        const { courseId, studentId } = payload
        const response = yield call(coursePageMutationsGraphQL.DeleteAccessCourseRelationStudent, { courseId, studentId })
        console.log(response)

        yield put(deleteCourseAccessRelationStudentSuccess(response.data.DeleteAccessCourseRelationStudent))
        notification.success({ message: '', description: 'Доступ успешно удален!' })
    } catch (e) {
        yield put(deleteCourseAccessRelationStudentFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

export function* coursePageSaga() {
    yield takeLatest(createCourseAccessRelationStudentRequest, createCourseAccessRelationStudentSaga)
    yield takeLatest(createCourseAccessRelationTeacherRequest, createCourseAccessRelationTeacherSaga)
    yield takeLatest(createCourseAccessRelationUnitAdminRequest, createCourseAccessRelationUnitAdminSaga)
    yield takeLatest(createCourseAccessRelationRobboUnitRequest, createCourseAccessRelationRobboUnitSaga)
    yield takeLatest(createCourseAccessRelationRobboGroupRequest, createCourseAccessRelationRobboGroupSaga)

    yield takeLatest(deleteCourseAccessRelationStudentRequest, deleteCourseAccessRelationStudentSaga)
}