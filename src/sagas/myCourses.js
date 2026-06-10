import { call, put, takeLatest, select } from 'redux-saga/effects'

import { notification } from 'antd'

import { formatMessageId } from '@/helpers/intl'

import { coursePageAPI } from '@/api'
import {
    getAllCoursePages,
    getAllCoursePagesFailed,
    getAllCoursePagesSuccess,
    getCoursePageById,
    getCoursePageByIdFailed,
    getCoursePageByIdSuccess,
    getCoursePagesByUserFailed,
    getCoursePagesByUserRequest,
    getCoursePagesByUserSuccess,
} from '@/actions'
import { coursePageQuerysGraphQL } from '@/graphQL'


function* getAllCoursePagesSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(coursePageAPI.getAllCoursePages, token)
        console.log(response)

        yield put(getAllCoursePagesSuccess(response.data.results))
    } catch (e) {
        yield put(getAllCoursePagesFailed(e.message))
    }
}

function* getCoursePageByIdSaga(action) {
    try {
        const { token } = action.payload
        const { id } = action.payload
        const response = yield call(coursePageAPI.getCoursePageById, token, id)
        console.log(response)

        yield put(getCoursePageByIdSuccess(response.data))
    } catch (e) {
        yield put(getCoursePageByIdFailed(e.message))
    }
}

function* getCoursePagesByUserSaga(action) {
    const language = yield select(state => state.app.language)
    try {
        const response = yield call(coursePageQuerysGraphQL.GetCoursesByUser)
        console.log(response)

        yield put(getCoursePagesByUserSuccess(response.data?.GetCoursesByUser?.results))
    } catch (e) {
        yield put(getCoursePagesByUserFailed(e.message))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

export function* myCoursesSaga() {
    yield takeLatest(getAllCoursePages, getAllCoursePagesSaga)
    yield takeLatest(getCoursePageById, getCoursePageByIdSaga)
    yield takeLatest(getCoursePagesByUserRequest, getCoursePagesByUserSaga)
}