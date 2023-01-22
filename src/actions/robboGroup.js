import { createAction } from "redux-actions"

import {
    ADD_STUDENT_TO_ROBBO_GROUP,
    ADD_STUDENT_TO_ROBBO_GROUP_SUCCESS,
    CREATE_ROBBO_GROUP,
    DELETE_STUDENT_FROM_ROBBO_GROUP,
    DELETE_STUDENT_FROM_ROBBO_GROUP_FAILED,
    DELETE_STUDENT_FROM_ROBBO_GROUP_SUCCESS,
    DELETE_ROBBO_GROUP, DELETE_ROBBO_GROUP_SUCCESS,
    DELETE_ROBBO_GROUP_FAILED,
    GET_ROBBO_GROUP_BY_ID,
    GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID,
    GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_SUCCESS,
    GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_FAILED,
    CREATE_ROBBO_GROUP_SUCCESS,
    CREATE_ROBBO_GROUP_FAILED,
    GET_ROBBO_GROUP_BY_ID_SUCCESS,
    GET_ROBBO_GROUP_BY_ID_FAILED,
    ADD_STUDENT_TO_ROBBO_GROUP_FAILED,
    SET_TEACHER_FOR_ROBBO_GROUP,
    SET_TEACHER_FOR_ROBBO_GROUP_SUCCESS,
    SET_TEACHER_FOR_ROBBO_GROUP_FAILED,
    DELETE_TEACHER_FOR_ROBBO_GROUP,
    DELETE_TEACHER_FOR_ROBBO_GROUP_SUCCESS,
    DELETE_TEACHER_FOR_ROBBO_GROUP_FAILED,
    SEARCH_ROBBO_GROUP_BY_TITLE,
    SEARCH_ROBBO_GROUP_BY_TITLE_SUCCESS,
    SEARCH_ROBBO_GROUP_BY_TITLE_FAILED,
    GET_ROBBO_GROUPS_BY_ACCESS_TOKEN,
    GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_SUCCESS,
    GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_FAILED,
    GET_ALL_ROBBO_GROUPS,
    GET_ALL_ROBBO_GROUPS_SUCCESS,
    GET_ALL_ROBBO_GROUPS_FAILED,
    UPDATE_ROBBO_GROUP,
    UPDATE_ROBBO_GROUP_SUCCESS,
    UPDATE_ROBBO_GROUP_FAILED,
    CLEAR_ROBBO_GROUPS_PAGE,
    CLEAR_ROBBO_GROUP_PAGE,
    GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN,
    GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN_SUCCESS,
    GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN_FAILED,
} from "@/constants"

export const getRobboGroupByIdRequest = createAction(GET_ROBBO_GROUP_BY_ID, (robboUnitId, robboGroupId) => ({ robboUnitId, robboGroupId }))
export const getRobboGroupByIdSuccess = createAction(GET_ROBBO_GROUP_BY_ID_SUCCESS, response => ({ response }))
export const getRobboGroupByIdFailed = createAction(GET_ROBBO_GROUP_BY_ID_FAILED, err => ({ err }))

export const getRobboGroupsByRobboUnitIdRequest = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID, robboUnitId => ({ robboUnitId }))
export const getRobboGroupsByRobboUnitIdSuccess = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_SUCCESS, response => ({ response }))
export const getRobboGroupsByRobboUnitIdFailed = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_FAILED, err => ({ err }))

export const createRobboGroupRequest = createAction(CREATE_ROBBO_GROUP, (robboUnitId, robboGroup) => ({ robboUnitId, robboGroup }))
export const createRobboGroupSuccess = createAction(CREATE_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const createRobboGroupFailed = createAction(CREATE_ROBBO_GROUP_FAILED, err => ({ err }))

export const deleteRobboGroupRequest = createAction(DELETE_ROBBO_GROUP, (robboUnitId, robboGroupId, robboGroupIndex) => (
    { robboUnitId, robboGroupId, robboGroupIndex }),
)
export const deleteRobboGroupSuccess = createAction(DELETE_ROBBO_GROUP_SUCCESS, (response, robboGroupIndex) => ({ response, robboGroupIndex }))
export const deleteRobboGroupFailed = createAction(DELETE_ROBBO_GROUP_FAILED, err => ({ err }))

export const addStudentToRobboGroupRequest = createAction(ADD_STUDENT_TO_ROBBO_GROUP, (robboGroup, studentId) => ({ robboGroup, studentId }))
export const addStudentToRobboGroupSuccess = createAction(ADD_STUDENT_TO_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const addStudentToRobboGroupFailed = createAction(ADD_STUDENT_TO_ROBBO_GROUP_FAILED, err => ({ err }))

export const deleteStudentFromRobboGroupRequest = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP, (robboGroupId, studentId) => (
    { robboGroupId, studentId }),
)
export const deleteStudentFromRobboGroupSuccess = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const deleteStudentFromRobboGroupFailed = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP_FAILED, err => ({ err }))

export const setTeacherForRobboGroupRequest = createAction(SET_TEACHER_FOR_ROBBO_GROUP, (teacherId, robboGroupId) => ({ teacherId, robboGroupId }))
export const setTeacherForRobboGroupSuccess = createAction(SET_TEACHER_FOR_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const setTeacherForRobboGroupFailed = createAction(SET_TEACHER_FOR_ROBBO_GROUP_FAILED, err => ({ err }))

export const deleteTeacherForRobboGroupRequest = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP, (teacherId, robboGroupId) => (
    { teacherId, robboGroupId }),
)
export const deleteTeacherForRobboGroupSuccess = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const deleteTeacherForRobboGroupFailed = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP_FAILED, err => ({ err }))

export const searchRobboGroupsByTitleRequest = createAction(SEARCH_ROBBO_GROUP_BY_TITLE, title => ({ title }))
export const searchRobboGroupsByTitleSuccess = createAction(SEARCH_ROBBO_GROUP_BY_TITLE_SUCCESS, response => ({ response }))
export const searchRobboGroupsByTitleFailed = createAction(SEARCH_ROBBO_GROUP_BY_TITLE_FAILED, err => ({ err }))

export const getRobboGroupsByAccessTokenRequest = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN, (page, pageSize) => ({ page, pageSize }))
export const getRobboGroupsByAccessTokenSuccess = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_SUCCESS, response => ({ response }))
export const getRobboGroupsByAccessTokenFailed = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_FAILED, err => ({ err }))

export const getAllRobboGroupsRequest = createAction(GET_ALL_ROBBO_GROUPS, (page, pageSize) => ({ page, pageSize }))
export const getAllRobboGroupsSuccess = createAction(GET_ALL_ROBBO_GROUPS_SUCCESS, response => ({ response }))
export const getAllRobboGroupsFailed = createAction(GET_ALL_ROBBO_GROUPS_FAILED, err => ({ err }))

export const getAllRobboGroupsForUnitAdminRequest = createAction(GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN, (page, pageSize) => ({ page, pageSize }))
export const getAllRobboGroupsForUnitAdminSuccess = createAction(GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN_SUCCESS, response => ({ response }))
export const getAllRobboGroupsForUnitAdminFailed = createAction(GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN_FAILED, err => ({ err }))

export const updateRobboGroup = createAction(UPDATE_ROBBO_GROUP, robboGroup => ({ robboGroup }))
export const updateRobboGroupSuccess = createAction(UPDATE_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const updateRobboGroupFailed = createAction(UPDATE_ROBBO_GROUP_FAILED, err => ({ err }))

export const clearRobboGroupsPage = createAction(CLEAR_ROBBO_GROUPS_PAGE)
export const clearRobboGroupPage = createAction(CLEAR_ROBBO_GROUP_PAGE)
