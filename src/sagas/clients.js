import { call, put, takeLatest } from 'redux-saga/effects'

import {
    addParentFailed, addParentSuccess,
    getClients, getClientsFailed,
    getClientsSuccess, addParent,
    deleteParentSuccess, deleteParentFailed,
    deleteParentRequest, createChildreSuccess,
    createChildrenFailed, createChildren,
    deleteChildSuccess, deleteChildFailed,
    deleteChildRequest,
    getChildrenByParentIdSuccess,
    getChildrenByParentIdFailed,
    getChildrenByParentId,
    searchStudentSuccess,
    searchStudentFailed,
    searchStudent,
    createRelationSuccess,
    createRelationFailed,
    createRelation,
}
    from '@/actions'
import { clientsAPI } from '@/api'
import { getAllUsers } from '@/graphQL'

function* getClientsSaga(action) {
    try {
        const { token } = action.payload
        const result = yield call(getAllUsers)
        console.log(result)
        // const response = yield call(clientsAPI.getClients, token)
        // console.log(response)

        yield put(getClientsSuccess(result.data.GetAllParents))
    } catch (e) {
        yield put(getClientsFailed(e.message))
    }
}

function* addParentSaga(action) {
    try {
        const { token, parent } = action.payload
        const response = yield call(clientsAPI.addParent, token, parent)
        console.log(response)

        yield put(addParentSuccess(response.data, parent))
    } catch (e) {
        yield put(addParentFailed(e))
    }
}

function* deleteParentSaga(action) {
    try {
        const { token, parentId, parentIndex } = action.payload
        const response = yield call(clientsAPI.deleteParent, token, parentId)
        console.log(response)

        yield put(deleteParentSuccess(response.data, parentIndex))
    } catch (e) {
        yield put(deleteParentFailed)
    }
}

function* createChildrenSaga(action) {
    try {
        const { token, child, parentId } = action.payload
        const response = yield call(clientsAPI.createChildren, token, child, parentId)
        console.log(response)

        yield put(createChildreSuccess(response.data, child))
    } catch (e) {
        yield put(createChildrenFailed(e))
    }
}

function* deleteChildSaga(action) {
    try {
        const { token, childId, childIndex } = action.payload
        const response = yield call(clientsAPI.deleteChild, token, childId)
        console.log(response)

        yield put(deleteChildSuccess(response.data, childIndex))
    } catch (e) {
        yield put(deleteChildFailed(e))
    }
}

function* getChildrenByParentIdSaga(action) {
    try {
        const { token, parentId } = action.payload
        const response = yield call(clientsAPI.getCildrenByParentId, token, parentId)
        console.log(response)

        yield put(getChildrenByParentIdSuccess(response.data))
    } catch (e) {
        yield put(getChildrenByParentIdFailed(e.message))
    }
}

function* searchStudentSaga(action) {
    try {
        const { token, input } = action.payload
        const response = yield call(clientsAPI.searchStudent, token, input)
        console.log(response)

        yield put(searchStudentSuccess(response.data))
    } catch (e) {
        yield put(searchStudentFailed(e))
    }
}

function* createRelationSaga(action) {
    try {
        const { token, parentId, childId } = action.payload
        const response = yield call(clientsAPI.createRelation, token, parentId, childId)
        console.log(response)

        yield put(createRelationSuccess(response.data))
    } catch (e) {
        yield put(createRelationFailed(e))
    }
}

export function* clientsSaga() {
    yield takeLatest(getClients, getClientsSaga)
    yield takeLatest(addParent, addParentSaga)
    yield takeLatest(deleteParentRequest, deleteParentSaga)
    yield takeLatest(createChildren, createChildrenSaga)
    yield takeLatest(deleteChildRequest, deleteChildSaga)
    yield takeLatest(getChildrenByParentId, getChildrenByParentIdSaga)
    yield takeLatest(searchStudent, searchStudentSaga)
    yield takeLatest(createRelation, createRelationSaga)
}