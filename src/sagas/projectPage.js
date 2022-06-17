import { call, put, take, takeLatest } from 'redux-saga/effects';
import { projectPageAPI } from '@/api';
import {
    createProjectPage, createProjectPageFailed, createProjectPageSuccess,
    deleteProjectPage, deleteProjectPageFailed, deleteProjectPageSuccess,
    getAllProjectPages, getAllProjectPagesFailed, getAllProjectPagesSuccess,
    getProjectPageById, getProjectPageByIdFailed, getProjectPageByIdSuccess,
    updateProjectPage, updateProjectPageFailed, updateProjectPageSuccess
} from '@/actions';


function* getAllProjectPagesSaga(action) {
    try {

        const response = yield call(projectPageAPI.getAllProjectPages);
        console.log(response)

        yield put(getAllProjectPagesSuccess(response))
    } catch (e) {
        yield put(getAllProjectPagesFailed(e.message));
    }
}

function* getProjectPageByIdSaga(action) {
    try {

        const response = yield call(projectPageAPI.getProjectPageById);
        console.log(response)

        yield put(getProjectPageByIdSuccess(response))
    } catch (e) {
        yield put(getProjectPageByIdFailed(e.message));
    }
}

function* createProjectPageSaga(action) {
    try {

        const response = yield call(projectPageAPI.getProjectPageById);
        console.log(response)

        yield put(createProjectPageSuccess(response))
    } catch (e) {
        yield put(createProjectPageFailed(e.message));
    }
}

function* updateProjectPageSaga(action) {
    try {

        const response = yield call(projectPageAPI.getProjectPageById);
        console.log(response)

        yield put(updateProjectPageSuccess(response))
    } catch (e) {
        yield put(updateProjectPageFailed(e.message));
    }
}

function* deleteProjectPageSaga(action) {
    try {

        const response = yield call(projectPageAPI.getProjectPageById);
        console.log(response)

        yield put(deleteProjectPageSuccess(response))
    } catch (e) {
        yield put(deleteProjectPageFailed(e.message));
    }
}

export function* projectPageSaga() {
    yield takeLatest(getAllProjectPages, getAllProjectPagesSaga);
    yield takeLatest(getProjectPageById, getProjectPageByIdSaga);
    yield takeLatest(createProjectPage, createProjectPageSaga);
    yield takeLatest(updateProjectPage, updateProjectPageSaga);
    yield takeLatest(deleteProjectPage, deleteProjectPageSaga);
}