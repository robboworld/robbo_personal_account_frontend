import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import { projectPageAPI } from '@/api'
import {
    createProjectPage, createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPage, deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPages, getAllProjectPagesFailed, getAllProjectPagesSuccess,
    getProjectPageById, getProjectPageByIdFailed, getProjectPageByIdSuccess,
    updateProjectPage, updateProjectPageFailed, updateProjectPageSuccess,
    getProjectPagesByAccessToken, getProjectPageByAccessTokenSuccess,
    getProjectPageByAccessTokenFailed,
} from '@/actions'
import { projectPageQueryGraphQL } from '@/graphQL'


function* getAllProjectPagesSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(projectPageAPI.getAllProjectPages, token)
        console.log(response)

        yield put(getAllProjectPagesSuccess(response))
    } catch (e) {
        yield put(getAllProjectPagesFailed(e.message))
    }
}

function* getProjectPageByIdSaga(action) {
    try {

        const { token, id } = action.payload
        const response = yield call(projectPageQueryGraphQL.getProjectPageById, { projectPageID: id })
        console.log(response)

        yield put(getProjectPageByIdSuccess(response.data.GetProjectPageById))
    } catch (e) {
        yield put(getProjectPageByIdFailed(e.message))
    }
}

function* createProjectPageSaga(action) {
    try {
        const { token } = action.payload
        const response = yield call(projectPageAPI.createProjectPage, token)
        console.log(response)
        yield put(createProjectPageSuccess(response))
    } catch (e) {
        yield put(createProjectPageFailed(e.message))
    }
}

function* updateProjectPageSaga(action) {
    try {
        const { token, projectPage } = action.payload
        const response = yield call(projectPageAPI.updateProjectPage, token, projectPage)
        console.log(response)
        yield put(updateProjectPageSuccess(response))
    } catch (e) {
        yield put(updateProjectPageFailed(e.message))
    }
}

function* deleteProjectPageSaga(action) {
    try {
        const { token, projectPageId, projectPageIndex } = action.payload
        const response = yield call(projectPageAPI.deleteProjectPage, token, projectPageId)
        console.log(response)

        yield put(deleteProjectPageSuccess(projectPageIndex))
    } catch (e) {
        yield put(deleteProjectPageFailed(e.message))
    }
}

function* getProjectPagesByAccessTokenSaga(action) {
    try {
        const result = yield call(projectPageQueryGraphQL.getProjectPagesByAccessToken)
        console.log(result)
        yield put(getProjectPageByAccessTokenSuccess(result.data.GetAllProjectPagesByAccessToken))
    } catch (e) {
        yield put(getProjectPageByAccessTokenFailed(e.message))
    }
}

export function* myProjectsSaga() {
    yield takeLatest(getAllProjectPages, getAllProjectPagesSaga)
    yield takeLatest(getProjectPageById, getProjectPageByIdSaga)
    yield takeEvery(createProjectPage, createProjectPageSaga)
    yield takeLatest(updateProjectPage, updateProjectPageSaga)
    yield takeLatest(deleteProjectPage, deleteProjectPageSaga)
    yield takeLatest(getProjectPagesByAccessToken, getProjectPagesByAccessTokenSaga)
}