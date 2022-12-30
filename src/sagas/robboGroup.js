import { call, takeLatest, put } from 'redux-saga/effects'
import { notification } from 'antd'

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
    try {
        const { robboUnitId, robboGroupId, robboGroupIndex } = payload
        const response = yield call(robboGroupMutationsGraphQL.DeleteRobboGroup, robboUnitId, robboGroupId)
        console.log(response)

        yield put(deleteRobboGroupSuccess(response.data.DeleteRobboGroup, robboGroupIndex))
        notification.success({ message: '', description: 'Группа успешно удалена!' })
    } catch (e) {
        yield put(deleteRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createRobboGroupSaga({ payload }) {
    try {
        const { robboUnitId, robboGroup } = payload
        const response = yield call(robboGroupMutationsGraphQL.CreateRobboGroup, { id: robboUnitId, ...robboGroup })
        console.log(response)

        yield put(createRobboGroupSuccess(response.data.CreateRobboGroup))
        notification.success({ message: '', description: 'Группа успешно создана!' })
    } catch (e) {
        yield put(createRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getRobboGroupsByRobboUnitIdSaga({ payload }) {
    try {
        const { robboUnitId } = payload
        console.log(robboUnitId)
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByRobboUnitId, "1,", "10", robboUnitId)
        console.log(response)

        yield put(getRobboGroupsByRobboUnitIdSuccess(response.data.GetRobboGroupsByRobboUnitId.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByRobboUnitIdFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* addStudentToRobboGroupSaga({ payload }) {
    try {
        const { robboGroup, studentId } = payload
        const response = yield call(robboGroupMutationsGraphQL.SetRobboGroupIdForStudent, studentId, robboGroup.id, robboGroup.robboUnitId)
        console.log(response)

        yield put(addStudentToRobboGroupSuccess(response.data.SetRobboGroupIdForStudent))
        notification.success({ message: '', description: 'Ученик успешно добавлен в группу!' })
    } catch (e) {
        yield put(addStudentToRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteStudentFromRobboGroupSaga({ payload }) {
    try {
        const { robboGroup, studentId } = payload
        const response = yield call(robboGroupMutationsGraphQL.SetRobboGroupIdForStudent, studentId, robboGroup.id, robboGroup.robboUnitId)
        console.log(response)

        yield put(deleteStudentFromRobboGroupRequest(response.data))
        notification.success({ message: '', description: 'Ученик успешно удален из группы!' })
    } catch (e) {
        yield put(deleteStudentFromRobboGroupFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* searchRobboGroupsByTitleSaga(action) {
    try {
        const { title } = action.payload
        const response = yield call(robboGroupsQuerysGraphQL.SearchRobboGroupsByName, { name: title })
        console.log(response)

        yield put(searchRobboGroupsByTitleSuccess(response.data.SearchGroupsByName.robboGroups))
    } catch (e) {
        yield put(searchRobboGroupsByTitleFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getRobboGroupsByTeacherIdSaga(action) {
    try {
        const { teacherId } = action.payload
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByTeacherId, { teacherId })

        yield put(getRobboGroupsByTeacherIdSuccess(response.data.GetRobboGroupsByTeacherId.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByTeacherIdFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getRobboGroupsByAccessTokenSaga() {
    try {
        const response = yield call(robboGroupsQuerysGraphQL.GetRobboGroupsByAccessToken, "1", "10")
        console.log(response)

        yield put(getRobboGroupsByAccessTokenSuccess(response.data.GetRobboGroupsByAccessToken.robboGroups))
    } catch (e) {
        yield put(getRobboGroupsByAccessTokenFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getAllRobboGroupsSaga({ payload }) {
    try {
        const { page, pageSize } = payload
        const response = yield call(robboGroupsQuerysGraphQL.GetAllRobboGroups, page, pageSize)
        console.log(response)

        yield put(getAllRobboGroupsSuccess(response.data.GetAllRobboGroups.robboGroups))
    } catch (e) {
        yield put(getAllRobboGroupsFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
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
}