import { handleActions } from 'redux-actions'

import {
    getClients, getClientsSuccess,
    getClientsFailed, clearClientsState,
    addParent, addParentSuccess,
    addParentFailed, deleteParentRequest,
    deleteParentSuccess, deleteParentFailed,
    createChildren, createChildreSuccess,
    createChildrenFailed,
    deleteChildRequest,
    deleteChildSuccess,
    deleteChildFailed,
    getChildrenByParentId,
    getChildrenByParentIdSuccess,
    getChildrenByParentIdFailed,
    clearChildrenState,
    searchStudent,
    searchStudentSuccess,
    searchStudentFailed,
    createRelation,
    createRelationSuccess,
    createRelationFailed,
    getClientPageById,
    getClientPageByIdSuccess,
    getClientPageByIdFailed,
    clearClientPageState,
} from '@/actions'

const INITIAL_STATE = {
    clientsLoading: true,
    childrenLoading: true,
    parents: [],
    children: [],
    searchResult: [],
    client: {},
    clientLoading: true,
}

export default handleActions({
    [getClients](state, action) {
        return { ...state, clientsLoading: true }
    },
    [getClientsSuccess](state, action) {
        return { ...state, clientsLoading: false, parents: action.payload.clients }
    },
    [getClientsFailed](state, action) {
        return { ...state, clientsLoading: false }
    },
    [clearClientsState](state, action) {
        return { ...state }
    },
    [addParent](state) {
        return { ...state, clientsLoading: true }
    },
    [addParentSuccess](state, action) {
        const { response, parent } = action.payload
        return {
            ...state,
            clientsLoading: false,
            parents: [...state.parents, { userHttp: { id: response.parentId, ...parent }, children: [] }],
        }
    },
    [addParentFailed](state, action) {
        return { ...state, clientsLoading: false }
    },
    [deleteParentRequest](state) {
        return { ...state, clientsLoading: true }
    },
    [deleteParentSuccess](state, action) {
        const newParent = [...state.parents]
        newParent.splice(action.payload.parentIndex, 1)
        return { ...state, clientsLoading: false, parents: newParent }
    },
    [deleteParentFailed](state) {
        return { ...state, clientsLoading: false }
    },
    [createChildren](state) {
        return { ...state, childrenLoading: true }
    },
    [createChildreSuccess](state, action) {
        const { response, child } = action.payload
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
    [deleteChildSuccess](state, action) {
        const { childIndex } = action.payload
        const newChildren = [...state.children]
        console.log(childIndex)
        newChildren.splice(childIndex, 1)
        return { ...state, childrenLoading: false, children: newChildren }
    },
    [deleteChildFailed](state, action) {
        return { ...state, childrenLoading: false }
    },
    [getChildrenByParentId](state) {
        return { ...state, childrenLoading: true }
    },
    [getChildrenByParentIdSuccess](state, action) {
        const { response } = action.payload
        return { ...state, childrenLoading: false, children: response }
    },
    [getChildrenByParentIdFailed](state, action) {
        return { ...state, childrenLoading: false }
    },
    [clearChildrenState](state) {
        return { ...state, children: [] }
    },
    [searchStudent](state) {
        return { ...state, loading: true }
    },
    [searchStudentSuccess](state, action) {
        return { ...state, loading: false, searchResult: action.payload.response }
    },
    [searchStudentFailed](state, action) {
        return { ...state, loading: false }
    },
    [createRelation](state) {
        return { ...state, loading: true }
    },
    [createRelationSuccess](state, action) {
        return { ...state, loading: false }
    },
    [createRelationFailed](state, action) {
        return { ...state, loading: false }
    },
    [getClientPageById](state) {
        return { ...state, clientLoading: true }
    },
    [getClientPageByIdSuccess](state, action) {
        console.log(action)
        return { ...state, client: action.payload.client, clientLoading: false }
    },
    [getClientPageByIdFailed](state, action) {
        return { ...state, clientLoading: false }
    },
    [clearClientPageState](state) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getClientsState = state => state