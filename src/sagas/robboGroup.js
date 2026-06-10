import { call, takeLatest, put, select } from 'redux-saga/effects'

import { notification } from 'antd'

import { formatMessageId } from '@/helpers/intl'

import {
    addStudentToRobboGroupFailed,
    addStudentToRobboGroupRequest,
    addStudentToRobboGroupSuccess,
    createRobboGroupFailed,
    createRobboGroupRequest,
    createRobboGroupSuccess,
    deleteRobboGroupFailed,
    deleteRobboGroupRequest,
    deleteRobboGroupSuccess,
    deleteStudentFromRobboGroupFailed,
    deleteStudentFromRobboGroupRequest,
    getAllRobboGroupsFailed,
    getAllRobboGroupsSuccess,
    getRobboGroupByIdFailed,
    getRobboGroupByIdRequest,
    getRobboGroupByIdSuccess,
    getRobboGroupsByAccessTokenRequest,
    getRobboGroupsByAccessTokenFailed,
    getRobboGroupsByAccessTokenSuccess,
    getRobboGroupsByRobboUnitIdFailed,
    getRobboGroupsByRobboUnitIdRequest,
    getRobboGroupsByRobboUnitIdSuccess,
    getRobboGroupsByTeacherId,
    getRobboGroupsByTeacherIdFailed,
    getRobboGroupsByTeacherIdSuccess,
    searchRobboGroupsByTitleFailed,
    searchRobboGroupsByTitleRequest,
    searchRobboGroupsByTitleSuccess,
    getAllRobboGroupsRequest,
    getAllRobboGroupsForUnitAdminRequest,
    getAllRobboGroupsForUnitAdminSuccess,
    getAllRobboGroupsForUnitAdminFailed,
} from '@/actions'
import {
    robboGroupMutationsGraphQL,
    robboGroupsQuerysGraphQL,
} from '@/graphQL'

function* getRobboGroupByIdSaga(action) {
    try {
        const { token, robboUnitId, robboGroupId } = action.payload
        console.log(action)
        const response = yield call(robboGroupsQuerysGraphQL.getRobboGroupById, token, robboUnitId, robboGroupId)
        console.log(response)

        yield put(getRobboGroupByIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboGroupByIdFailed(e.message))
    }
}

function* deleteRobboGroupSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnitId, robboGroupId, robboGroupIndex } = payload
        const response = yield call(robboGroupMutationsGraphQL.DeleteRobboGroup, robboGroupId)
        console.log(response)

        yield put(deleteRobboGroupSuccess(response.data.DeleteRobboGroup, robboGroupIndex))
        notification.success({ message: '', description: formatMessageId(language, 'notification.group_delete_success') })
    } catch (e) {
        yield put(deleteRobboGroupFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createRobboGroupSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnitId, robboGroup } = payload
        console.log(robboUnitId, robboGroup)
        const response = yield call(robboGroupMutationsGraphQL.CreateRobboGroup, { robboUnitId: String(robboUnitId), ...robboGroup })
        console.log(response)

        yield put(createRobboGroupSuccess(response.data.CreateRobboGroup))
        notification.success({ message: '', description: formatMessageId(language, 'notification.robbo_group_create_success') })
    } catch (e) {
        yield put(createRobboGroupFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getRobboGroupsByRobboUnitIdSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboUnitId, page, pageSize } = payload
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByRobboUnitId, page, pageSize, robboUnitId)
        console.log(response)

        yield put(getRobboGroupsByRobboUnitIdSuccess(response.data.GetRobboGroupsByRobboUnitId))
    } catch (e) {
        yield put(getRobboGroupsByRobboUnitIdFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* addStudentToRobboGroupSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboGroup, studentId } = payload
        const response = yield call(robboGroupMutationsGraphQL.SetRobboGroupIdForStudent, studentId, robboGroup.id, robboGroup.robboUnitId)
        console.log(response)

        yield put(addStudentToRobboGroupSuccess(response.data.SetRobboGroupIdForStudent))
        notification.success({ message: '', description: formatMessageId(language, 'notification.student_added_to_group_success') })
    } catch (e) {
        yield put(addStudentToRobboGroupFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* deleteStudentFromRobboGroupSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { robboGroup, studentId } = payload
        const response = yield call(robboGroupMutationsGraphQL.SetRobboGroupIdForStudent, studentId, robboGroup.id, robboGroup.robboUnitId)
        console.log(response)

        yield put(deleteStudentFromRobboGroupRequest(response.data))
        notification.success({ message: '', description: formatMessageId(language, 'notification.student_removed_from_group_success') })
    } catch (e) {
        yield put(deleteStudentFromRobboGroupFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* searchRobboGroupsByTitleSaga(action) {
    const language = yield select(state => state.app.language)
    try {
        const { title } = action.payload
        const response = yield call(robboGroupsQuerysGraphQL.SearchRobboGroupsByName, { name: title })
        console.log(response)

        yield put(searchRobboGroupsByTitleSuccess(response.data.SearchGroupsByName.robboGroups))
    } catch (e) {
        yield put(searchRobboGroupsByTitleFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getRobboGroupsByTeacherIdSaga(action) {
    const language = yield select(state => state.app.language)
    try {
        const { teacherId, page, pageSize } = action.payload
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByTeacherId, teacherId, page, pageSize)

        yield put(getRobboGroupsByTeacherIdSuccess(response.data.GetRobboGroupsByTeacherId.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByTeacherIdFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getRobboGroupsByAccessTokenSaga() {
    const language = yield select(state => state.app.language)
    try {
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByAccessToken, "1", "10")
        console.log(response)

        yield put(getRobboGroupsByAccessTokenSuccess(response.data.GetRobboGroupsByAccessToken.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByAccessTokenFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getAllRobboGroupsSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { page, pageSize } = payload
        const response = yield call(robboGroupsQuerysGraphQL.GetAllRobboGroups, page, pageSize)
        console.log(response)

        yield put(getAllRobboGroupsSuccess(response.data.GetAllRobboGroups))
    } catch (e) {
        yield put(getAllRobboGroupsFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getAllRobboGroupsForUnitAdminSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { page, pageSize } = payload
        const response = yield call(robboGroupsQuerysGraphQL.GetAllRobboGroupsForUnitAdmin, page, pageSize)
        console.log(response)

        yield put(getAllRobboGroupsForUnitAdminSuccess(response.data.GetAllRobboGroupsForUnitAdmin.robboGroups))
    } catch (e) {
        yield put(getAllRobboGroupsForUnitAdminFailed(e))
        notification.error({ message: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

export function* robboGroupSaga() {
    yield takeLatest(getRobboGroupByIdRequest, getRobboGroupByIdSaga)
    yield takeLatest(deleteRobboGroupRequest, deleteRobboGroupSaga)
    yield takeLatest(createRobboGroupRequest, createRobboGroupSaga)
    yield takeLatest(getRobboGroupsByRobboUnitIdRequest, getRobboGroupsByRobboUnitIdSaga)
    yield takeLatest(addStudentToRobboGroupRequest, addStudentToRobboGroupSaga)
    yield takeLatest(deleteStudentFromRobboGroupRequest, deleteStudentFromRobboGroupSaga)
    yield takeLatest(searchRobboGroupsByTitleRequest, searchRobboGroupsByTitleSaga)
    yield takeLatest(getRobboGroupsByTeacherId, getRobboGroupsByTeacherIdSaga)
    yield takeLatest(getRobboGroupsByAccessTokenRequest, getRobboGroupsByAccessTokenSaga)
    yield takeLatest(getAllRobboGroupsRequest, getAllRobboGroupsSaga)
    yield takeLatest(getAllRobboGroupsForUnitAdminRequest, getAllRobboGroupsForUnitAdminSaga)
}