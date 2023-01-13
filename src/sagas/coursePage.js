import { call, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import { coursePageMutationsGraphQL } from '@/graphQL'
import {
    createCourseAccessRelationStudentFailed,
    createCourseAccessRelationStudentRequest,
    createCourseAccessRelationStudentSuccess,
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
    yield takeLatest(deleteCourseAccessRelationStudentRequest, deleteCourseAccessRelationStudentSaga)
}