import { call, takeLatest, put } from 'redux-saga/effects'

import { robboGroupAPI } from '@/api'
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
    getRobboGroupsByAccessToken,
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
} from '@/actions'
import { robboGroupsQueryGraphQL } from '@/graphQL/query'

function* getRobboGroupByIdSaga(action) {
    try {
        const { token, robboUnitId, robboGroupId } = action.payload
        console.log(action)
        const response = yield call(robboGroupAPI.getRobboGroupById, token, robboUnitId, robboGroupId)
        console.log(response)

        yield put(getRobboGroupByIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboGroupByIdFailed(e.message))
    }
}

function* deleteRobboGroupSaga(action) {
    try {
        const { token, robboUnitId, robboGroupId, robboGroupIndex } = action.payload
        const response = yield call(robboGroupAPI.deleteRobboGroup, token, robboUnitId, robboGroupId)
        console.log(response)

        yield put(deleteRobboGroupSuccess(response.data, robboGroupIndex))
    } catch (e) {
        yield put(deleteRobboGroupFailed(e))
    }
}

function* createRobboGroupSaga(action) {
    try {
        const { token, robboUnitId, robboGroup } = action.payload
        console.log(action.payload)
        const response = yield call(robboGroupAPI.createRobboGroup, token, robboUnitId, robboGroup)
        console.log(response)

        yield put(createRobboGroupSuccess(response.data, robboGroup))
    } catch (e) {
        yield put(createRobboGroupFailed(e))
    }
}

function* getRobboGroupsByRobboUnitIdSaga(action) {
    try {
        const { token, robboUnitId } = action.payload
        const response = yield call(robboGroupAPI.getRobboGroupsByRobboUnitId, token, robboUnitId)
        console.log(response)

        yield put(getRobboGroupsByRobboUnitIdSuccess(response.data))
    } catch (e) {
        yield put(getRobboGroupsByRobboUnitIdFailed(e))
    }
}

function* addStudentToRobboGroupSaga(action) {
    try {
        const { token, robboGroup, studentId } = action.payload
        const response = yield call(robboGroupAPI.addStudentToRobboGroup, token, robboGroup, studentId)
        console.log(response)

        yield put(addStudentToRobboGroupSuccess(response.data))
    } catch (e) {
        yield put(addStudentToRobboGroupFailed(e))
    }
}

function* deleteStudentFromRobboGroupSaga(action) {
    try {
        const { token, robboGroup, studentId } = action.payload
        const response = yield call(robboGroupAPI.deleteStudentFromRobboGroup, token, robboGroup, studentId)
        console.log(response)

        yield put(deleteStudentFromRobboGroupRequest(response.data))
    } catch (e) {
        yield put(deleteStudentFromRobboGroupFailed(e))
    }
}

function* searchRobboGroupsByTitleSaga(action) {
    try {
        const { token, title } = action.payload
        const response = yield call(robboGroupsQueryGraphQL.searchRobboGroupsByName, { name: title })
        console.log(response)

        yield put(searchRobboGroupsByTitleSuccess(response.data.SearchGroupsByName))
    } catch (e) {
        yield put(searchRobboGroupsByTitleFailed(e))
    }
}

function* getRobboGroupsByTeacherIdSaga(action) {
    try {
        const { teacherId } = action.payload
        const response = yield call(robboGroupsQueryGraphQL.getRobboGroupsByTeacherId, { teacherId })

        yield put(getRobboGroupsByTeacherIdSuccess(response.data.GetRobboGroupsByTeacherId))
    } catch (e) {
        yield put(getRobboGroupsByTeacherIdFailed(e))
    }
}

function* getRobboGroupsByAccessTokenSaga() {
    try {
        const response = yield call(robboGroupsQueryGraphQL.getRobboGroupsByAccessToken)
        console.log(response)

        yield put(getRobboGroupsByAccessTokenSuccess(response.data.GetRobboGroupsByAccessToken.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByAccessTokenFailed(e))
    }
}

function* getAllRobboGroupsSaga({ payload }) {
    try {
        const { page, pageSize } = payload
        const response = yield call(robboGroupsQueryGraphQL.getAllRobboGroups, page, pageSize)
        console.log(response)

        yield put(getAllRobboGroupsSuccess(response.data.GetAllRobboGroups.robboGroups))
    } catch (e) {
        yield put(getAllRobboGroupsFailed(e))
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
    yield takeLatest(getRobboGroupsByAccessToken, getRobboGroupsByAccessTokenSaga)
    yield takeLatest(getAllRobboGroupsRequest, getAllRobboGroupsSaga)
}