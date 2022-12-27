import { call, put, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'

import {
    createParentFailed,
    createParentSuccess,
    getClientsRequest,
    getClientsFailed,
    getClientsSuccess,
    deleteParentSuccess,
    deleteParentFailed,
    deleteParentRequest,
    createChildrenSuccess,
    createChildrenFailed,
    deleteChildSuccess,
    deleteChildFailed,
    deleteChildRequest,
    getChildrenByParentIdSuccess,
    getChildrenByParentIdFailed,
    searchStudentSuccess,
    searchStudentFailed,
    createRelationSuccess,
    createRelationFailed,
    getClientPageByIdSuccess,
    getClientPageByIdFailed,
    createChildrenRequest,
    getChildrenByParentIdRequest,
    searchStudentRequest,
    createStudentParentRelationRequest,
    getClientPageByIdRequest,
    createParentRequest,
} from '@/actions'

import {
    parentQuerysGraphQL,
    studentQuerysGraphQL,
    studentMutationsGraphQL,
    parentMutationsGraphQL,
} from '@/graphQL'

function* getClientsSaga({ payload }) {
    try {
        const { page, pageSize } = payload
        const response = yield call(parentQuerysGraphQL.GetAllParents, page, pageSize)
        console.log(response)
        yield put(getClientsSuccess(response.data.GetAllParents.parents))
    } catch (e) {
        yield put(getClientsFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getClientByIdSaga({ payload }) {
    try {
        const { id } = payload
        const response = yield call(parentQuerysGraphQL.GetParentById, { parentId: id })
        console.log(response)
        yield put(getClientPageByIdSuccess(response.data.GetParentById))
    } catch (e) {
        yield put(getClientPageByIdFailed(e.message))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createParentSaga({ payload }) {
    try {
        const { parent } = payload
        const response = yield call(parentMutationsGraphQL.CreateParent, { input: parent })
        console.log(response)
        yield put(createParentSuccess(response.data.CreateParent))
        notification.success({ message: '', description: 'Родитель успешно создан!' })
    } catch (e) {
        yield put(createParentFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteParentSaga({ payload }) {
    try {
        const { parentId, parentIndex } = payload
        const response = yield call(parentMutationsGraphQL.DeleteParent, { parentId })
        console.log(response)

        yield put(deleteParentSuccess(response.data.DeleteParent, parentIndex))
        notification.success({ message: '', description: 'Родитель успешно удален!' })
    } catch (e) {
        yield put(deleteParentFailed)
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createChildrenSaga({ payload }) {
    try {
        const { child, parentId } = payload
        const response = yield call(studentMutationsGraphQL.CreateStudent, { input: { ...child, parentId } })
        console.log(response)

        yield put(createChildrenSuccess(response.data, child))
        notification.success({ message: '', description: 'Ученик успешно создан!' })
    } catch (e) {
        yield put(createChildrenFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* deleteChildSaga({ payload }) {
    try {
        const { childId, childIndex } = payload
        const response = yield call(studentMutationsGraphQL.DeleteStudent, { studentId: childId })
        console.log(response)

        yield put(deleteChildSuccess(response.data.DeleteStudent, childIndex))
        notification.success({ message: '', description: 'Ученик успешно удален!' })
    } catch (e) {
        yield put(deleteChildFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* getChildrenByParentIdSaga({ payload }) {
    try {
        const { parentId } = payload
        const response = yield call(studentQuerysGraphQL.GetStudentsByParentId, { parentId: parentId })
        console.log(response)

        yield put(getChildrenByParentIdSuccess(response.data.GetStudentsByParentId.students))
    } catch (e) {
        yield put(getChildrenByParentIdFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* searchStudentSaga({ payload }) {
    try {
        const { input } = payload
        const response = yield call(studentQuerysGraphQL.SearchStudentsByEmail, { email: input })
        console.log(response)

        yield put(searchStudentSuccess(response.data.SearchStudentsByEmail.students))
    } catch (e) {
        yield put(searchStudentFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

function* createStudentParentRelationSaga({ payload }) {
    try {
        const { parentId, childId } = payload
        const response = yield call(studentMutationsGraphQL.CreateStudentParentRelation, { parentId, childId })
        console.log(response)

        yield put(createRelationSuccess(response.data))
    } catch (e) {
        yield put(createRelationFailed(e))
        notification.error({ message: 'Ошибка', description: e.message })
    }
}

export function* clientsSaga() {
    yield takeLatest(getClientsRequest, getClientsSaga)
    yield takeLatest(createParentRequest, createParentSaga)
    yield takeLatest(deleteParentRequest, deleteParentSaga)
    yield takeLatest(createChildrenRequest, createChildrenSaga)
    yield takeLatest(deleteChildRequest, deleteChildSaga)
    yield takeLatest(getChildrenByParentIdRequest, getChildrenByParentIdSaga)
    yield takeLatest(searchStudentRequest, searchStudentSaga)
    yield takeLatest(createStudentParentRelationRequest, createStudentParentRelationSaga)
    yield takeLatest(getClientPageByIdRequest, getClientByIdSaga)
}