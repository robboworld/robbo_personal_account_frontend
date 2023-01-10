import { createAction } from 'redux-actions'

import {
    GET_CLIENTS_REQUEST,
    GET_CLIENTS_SUCCESS,
    GET_CLIENTS_FAILED,
    GET_CLIENT_PAGE_BY_ID_REQUEST,
    GET_CLIENT_PAGE_BY_ID_SUCCESS,
    GET_CLIENT_PAGE_BY_ID_FAILED,
    CLEAR_CLIENTS_STATE,
    CREATE_PARENT_REQUEST,
    CREATE_PARENT_SUCCESS,
    CREATE_PARENT_FAILED,
    DELETE_PARENT_REQUEST,
    DELETE_PARENT_SUCCESS,
    DELETE_PARENT_FAILED,
    CREATE_CHILDREN_REQUEST,
    CREATE_CHILDREN_SUCCESS,
    CREATE_CHILDREN_FAILED,
    DELETE_CHILD_SUCCESS,
    DELETE_CHILD_FAILED,
    DELETE_CHILD_REQUEST,
    GET_CHILDREN_BY_PARENT_ID,
    GET_CHILDREN_BY_PARENT_ID_SUCCESS,
    GET_CHILDREN_BY_PARENT_ID_FAILED,
    CLEAR_CHILDREN_STATE,
    SEARCH_STUDENT_REQUEST,
    SEARCH_STUDENT_SUCCESS,
    SEARCH_STUDENT_FAILED,
    CREATE_RELATION,
    CREATE_RELATION_SUCCESS,
    CREATE_RELATION_FAILED,
} from '@/constants'

export const getClientsRequest = createAction(GET_CLIENTS_REQUEST, (page, pageSize) => ({ page, pageSize }))
export const getClientsSuccess = createAction(GET_CLIENTS_SUCCESS, response => ({ response }))
export const getClientsFailed = createAction(GET_CLIENTS_FAILED, err => ({ err }))

export const getClientPageByIdRequest = createAction(GET_CLIENT_PAGE_BY_ID_REQUEST, id => ({ id }))
export const getClientPageByIdSuccess = createAction(GET_CLIENT_PAGE_BY_ID_SUCCESS, response => ({ response }))
export const getClientPageByIdFailed = createAction(GET_CLIENT_PAGE_BY_ID_FAILED, err => ({ err }))

export const createParentRequest = createAction(CREATE_PARENT_REQUEST, parent => ({ parent }))
export const createParentSuccess = createAction(CREATE_PARENT_SUCCESS, response => ({ response }))
export const createParentFailed = createAction(CREATE_PARENT_FAILED, err => ({ err }))

export const deleteParentRequest = createAction(DELETE_PARENT_REQUEST, (parentId, parentIndex) => ({ parentId, parentIndex }))
export const deleteParentSuccess = createAction(DELETE_PARENT_SUCCESS, (response, parentIndex) => ({ response, parentIndex }))
export const deleteParentFailed = createAction(DELETE_PARENT_FAILED, err => ({ err }))

export const createChildrenRequest = createAction(CREATE_CHILDREN_REQUEST, (child, parentId) => ({ child, parentId }))
export const createChildrenSuccess = createAction(CREATE_CHILDREN_SUCCESS, (response, child) => ({ response, child }))
export const createChildrenFailed = createAction(CREATE_CHILDREN_FAILED, err => ({ err }))

export const deleteChildRequest = createAction(DELETE_CHILD_REQUEST, (childId, childIndex) => ({ childId, childIndex }))
export const deleteChildSuccess = createAction(DELETE_CHILD_SUCCESS, (response, childIndex) => ({ response, childIndex }))
export const deleteChildFailed = createAction(DELETE_CHILD_FAILED, err => ({ err }))

export const getChildrenByParentIdRequest = createAction(GET_CHILDREN_BY_PARENT_ID, parentId => ({ parentId }))
export const getChildrenByParentIdSuccess = createAction(GET_CHILDREN_BY_PARENT_ID_SUCCESS, response => ({ response }))
export const getChildrenByParentIdFailed = createAction(GET_CHILDREN_BY_PARENT_ID_FAILED, err => ({ err }))

export const searchStudentRequest = createAction(SEARCH_STUDENT_REQUEST, input => ({ input }))
export const searchStudentSuccess = createAction(SEARCH_STUDENT_SUCCESS, response => ({ response }))
export const searchStudentFailed = createAction(SEARCH_STUDENT_FAILED, err => ({ err }))

export const createStudentParentRelationRequest = createAction(CREATE_RELATION, (parentId, childId) => ({ parentId, childId }))
export const createRelationSuccess = createAction(CREATE_RELATION_SUCCESS, response => ({ response }))
export const createRelationFailed = createAction(CREATE_RELATION_FAILED, err => ({ err }))

export const clearClientsState = createAction(CLEAR_CLIENTS_STATE)
export const clearChildrenState = createAction(CLEAR_CHILDREN_STATE)