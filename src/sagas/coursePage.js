import { call, put, takeLatest, select } from 'redux-saga/effects'

import { notification } from 'antd'

import { formatMessageId } from '@/helpers/intl'

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
    const language = yield select(state => state.app.language)
    try {
        const { courseId, studentId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationStudent, { input: { courseId, studentId } })
        console.log(response)

        yield put(createCourseAccessRelationStudentSuccess(response.data.CreateAccessCourseRelationStudent))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_added_success') })
    } catch (e) {
        yield put(createCourseAccessRelationStudentFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createCourseAccessRelationTeacherSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { courseId, teacherId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationTeacher, { input: { courseId, teacherId } })
        console.log(response)

        yield put(createCourseAccessRelationTeacherSuccess(response.data.CreateAccessCourseRelationTeacher))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_added_success') })
    } catch (e) {
        yield put(createCourseAccessRelationTeacherFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createCourseAccessRelationUnitAdminSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { courseId, unitAdminId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationUnitAdmin, { input: { courseId, unitAdminId } })
        console.log(response)

        yield put(createCourseAccessRelationUnitAdminSuccess(response.data.CreateAccessCourseRelationUnitAdmin))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_added_success') })
    } catch (e) {
        yield put(createCourseAccessRelationUnitAdminFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createCourseAccessRelationRobboUnitSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { courseId, robboUnitId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationRobboUnit, { input: { courseId, robboUnitId } })
        console.log(response)

        yield put(createCourseAccessRelationRobboUnitSuccess(response.data.CreateAccessCourseRelationRobboUnit))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_added_success') })
    } catch (e) {
        yield put(createCourseAccessRelationRobboUnitFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createCourseAccessRelationRobboGroupSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { courseId, robboGroupId } = payload
        const response = yield call(coursePageMutationsGraphQL.CreateAccessCourseRelationRobboGroup, { input: { courseId, robboGroupId } })
        console.log(response)

        yield put(createCourseAccessRelationRobboGroupSuccess(response.data.CreateAccessCourseRelationStudent))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_added_success') })
    } catch (e) {
        yield put(createCourseAccessRelationRobboGroupFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* deleteCourseAccessRelationStudentSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { courseId, studentId } = payload
        const response = yield call(coursePageMutationsGraphQL.DeleteAccessCourseRelationStudent, { courseId, studentId })
        console.log(response)

        yield put(deleteCourseAccessRelationStudentSuccess(response.data.DeleteAccessCourseRelationStudent))
        notification.success({ message: '', description: formatMessageId(language, 'notification.access_removed_success') })
    } catch (e) {
        yield put(deleteCourseAccessRelationStudentFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
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