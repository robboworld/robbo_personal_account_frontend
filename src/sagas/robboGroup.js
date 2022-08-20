import { call, takeLatest, put } from 'redux-saga/effects'

import { robboGroupAPI } from '@/api'
import {
    createRobboGroupFailed,
    createRobboGroupRequest, createRobboGroupSuccess, deleteRobboGroupFailed, deleteRobboGroupRequest,
    deleteRobboGroupSuccess,
    getRobboGroupByIdFailed,
    getRobboGroupByIdRequest, getRobboGroupByIdSuccess,
    getRobboGroupsByRobboUnitIdFailed, getRobboGroupsByRobboUnitIdRequest,
    getRobboGroupsByRobboUnitIdSuccess,
    getStudentsOfRobboGroup,
} from '@/actions'

function* getRobboGroupByIdSaga(action) {
    try {
        const { token, robboUnitId, robboGroupId } = action.payload
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

// function* getStudentsOfRobboGroupSaga(action) {
//     try {
//         const { robboUnitId } = action.payload
//         const response = yield call(robboGroupAPI., robboUnitId)
//         console.log(response)

//         yield put(getRobboGroupsByRobboUnitIdSuccess(response.data))
//     } catch (e) {
//         yield put(getRobboGroupsByRobboUnitIdFailed(e))
//     }
// }

export function* robboGroupSaga() {
    yield takeLatest(getRobboGroupByIdRequest, getRobboGroupByIdSaga)
    yield takeLatest(deleteRobboGroupRequest, deleteRobboGroupSaga)
    yield takeLatest(createRobboGroupRequest, createRobboGroupSaga)
    yield takeLatest(getRobboGroupsByRobboUnitIdRequest, getRobboGroupsByRobboUnitIdSaga)
    // yield takeLatest(getStudentsOfRobboGroup, getStudentsOfRobboGroupSaga)
}