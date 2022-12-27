import { handleActions } from 'redux-actions'

import {
    getClientsRequest,
    getClientsSuccess,
    getClientsFailed,
    clearClientsState,
    createParentRequest,
    createParentSuccess,
    createParentFailed,
    deleteParentRequest,
    deleteParentSuccess,
    deleteParentFailed,
    createChildrenRequest,
    createChildrenSuccess,
    createChildrenFailed,
    deleteChildRequest,
    deleteChildSuccess,
    deleteChildFailed,
    getChildrenByParentIdSuccess,
    getChildrenByParentIdFailed,
    clearChildrenState,
    searchStudentRequest,
    searchStudentSuccess,
    searchStudentFailed,
    createRelationSuccess,
    createRelationFailed,
    getClientPageByIdRequest,
    getClientPageByIdSuccess,
    getClientPageByIdFailed,
    getChildrenByParentIdRequest,
    createStudentParentRelationRequest,
} from '@/actions'

const INITIAL_STATE = {
    parents: [],
    children: [],
    searchResult: [],
    client: {},
    clientLoading: true,
    clientsLoading: true,
    childrenLoading: true,
}

export default handleActions({
    [getClientsRequest](state, action) {
        return { ...state, clientsLoading: true }
    },
    [getClientsSuccess](state, { payload }) {
        return { ...state, clientsLoading: false, parents: payload.response }
    },
    [getClientsFailed](state, action) {
        return { ...state, clientsLoading: false }
    },
    [createParentRequest](state) {
        return { ...state, clientsLoading: true }
    },
    [createParentSuccess](state, { payload }) {
        const { response } = payload
        return {
            ...state,
            clientsLoading: false,
            parents: [...state.parents, { userHttp: { ...response.userHttp }, children: [] }],
        }
    },
    [createParentFailed](state, action) {
        return { ...state, clientsLoading: false }
    },
    [deleteParentRequest](state) {
        return { ...state, clientsLoading: true }
    },
    [deleteParentSuccess](state, { payload }) {
        const newParents = [...state.parents]
        newParents.splice(payload.parentIndex, 1)
        return { ...state, clientsLoading: false, parents: newParents }
    },
    [deleteParentFailed](state) {
        return { ...state, clientsLoading: false }
    },
    [createChildrenRequest](state) {
        return { ...state, childrenLoading: true }
    },
    [createChildrenSuccess](state, { payload }) {
        const { response, child } = payload
        return {
            ...state,
            childrenLoading: false,
            children: [...state.children, { userHttp: { id: response.studentId, ...child } }],
        }
    },
    [createChildrenFailed](state, action) {
        return { ...state, childrenLoading: false }
    },
    [deleteChildRequest](state) {
        return { ...state, childrenLoading: true }
    },
    [deleteChildSuccess](state, { payload }) {
        const { childIndex } = payload
        const newChildren = [...state.children]
        newChildren.splice(childIndex, 1)
        return { ...state, childrenLoading: false, children: newChildren }
    },
    [deleteChildFailed](state, action) {
        return { ...state, childrenLoading: false }
    },
    [getChildrenByParentIdRequest](state) {
        return { ...state, childrenLoading: true }
    },
    [getChildrenByParentIdSuccess](state, { payload }) {
        const { response } = payload
        return { ...state, childrenLoading: false, children: response }
    },
    [getChildrenByParentIdFailed](state, action) {
        return { ...state, childrenLoading: false }
    },
    [clearChildrenState](state) {
        return { ...state, children: [] }
    },
    [searchStudentRequest](state) {
        return { ...state, loading: true }
    },
    [searchStudentSuccess](state, { payload }) {
        return { ...state, loading: false, searchResult: payload.response }
    },
    [searchStudentFailed](state, action) {
        return { ...state, loading: false }
    },
    [createStudentParentRelationRequest](state) {
        return { ...state, loading: true }
    },
    [createRelationSuccess](state, action) {
        return { ...state, loading: false }
    },
    [createRelationFailed](state, action) {
        return { ...state, loading: false }
    },
    [getClientPageByIdRequest](state) {
        return { ...state, clientLoading: true }
    },
    [getClientPageByIdSuccess](state, { payload }) {
        return { ...state, client: payload.client, clientLoading: false }
    },
    [getClientPageByIdFailed](state, action) {
        return { ...state, clientLoading: false }
    },
    [clearClientsState](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getClientsState = state => state