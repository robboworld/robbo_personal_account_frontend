import { call, put, takeLatest, select } from 'redux-saga/effects'

import { notification } from 'antd'

import { formatMessageId } from '@/helpers/intl'

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
    const language = yield select(state => state.app.language)
    try {
        const { page, pageSize } = payload
        const response = yield call(parentQuerysGraphQL.GetAllParents, page, pageSize)
        yield put(getClientsSuccess(response.data.GetAllParents))
    } catch (e) {
        yield put(getClientsFailed(e.message))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getClientByIdSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { id } = payload
        const response = yield call(parentQuerysGraphQL.GetParentById, { parentId: id })
        yield put(getClientPageByIdSuccess(response.data.GetParentById))
    } catch (e) {
        yield put(getClientPageByIdFailed(e.message))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createParentSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { parent } = payload
        const response = yield call(parentMutationsGraphQL.CreateParent, { input: parent })
        yield put(createParentSuccess(response.data.CreateParent))
        notification.success({ title: '', description: formatMessageId(language, 'notification.parent_create_success') })
    } catch (e) {
        yield put(createParentFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* deleteParentSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { parentId, parentIndex } = payload
        const response = yield call(parentMutationsGraphQL.DeleteParent, { parentId })

        yield put(deleteParentSuccess(response.data.DeleteParent, parentIndex))
        notification.success({ title: '', description: formatMessageId(language, 'notification.parent_delete_success') })
    } catch (e) {
        yield put(deleteParentFailed)
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createChildrenSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { child, parentId } = payload
        const response = yield call(studentMutationsGraphQL.CreateStudent, { input: { ...child, parentId } })

        yield put(createChildrenSuccess(response.data, child))
        notification.success({ title: '', description: formatMessageId(language, 'notification.student_create_success') })
    } catch (e) {
        yield put(createChildrenFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* deleteChildSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { childId, childIndex } = payload
        const response = yield call(studentMutationsGraphQL.DeleteStudent, { studentId: childId })

        yield put(deleteChildSuccess(response.data.DeleteStudent, childIndex))
        notification.success({ title: '', description: formatMessageId(language, 'notification.student_delete_success') })
    } catch (e) {
        yield put(deleteChildFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* getChildrenByParentIdSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { parentId } = payload
        const response = yield call(studentQuerysGraphQL.GetStudentsByParentId, { parentId })

        yield put(getChildrenByParentIdSuccess(response.data.GetStudentsByParentId.students))
    } catch (e) {
        yield put(getChildrenByParentIdFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* searchStudentSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { input } = payload
        const response = yield call(studentQuerysGraphQL.SearchStudentsByEmail, { email: input })

        yield put(searchStudentSuccess(response.data.SearchStudentsByEmail.students))
    } catch (e) {
        yield put(searchStudentFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
    }
}

function* createStudentParentRelationSaga({ payload }) {
    const language = yield select(state => state.app.language)
    try {
        const { parentId, childId } = payload
        const response = yield call(studentMutationsGraphQL.CreateStudentParentRelation, { parentId, childId })

        yield put(createRelationSuccess(response.data))
        notification.success({ title: '', description: formatMessageId(language, 'notification.student_added_success') })
    } catch (e) {
        yield put(createRelationFailed(e))
        notification.error({ title: formatMessageId(language, 'notification.error_message'), description: e.message })
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