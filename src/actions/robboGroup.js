import { createAction } from "redux-actions"
import { toast } from "react-toastify"

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
} from "@/constants"

export const getRobboGroupByIdRequest = createAction(GET_ROBBO_GROUP_BY_ID, (token, robboUnitId, robboGroupId) => {
    return {
        token,
        robboUnitId,
        robboGroupId,
    }
})

export const getRobboGroupByIdSuccess = createAction(GET_ROBBO_GROUP_BY_ID_SUCCESS, response => {
    return {
        response,
    }
})

export const getRobboGroupByIdFailed = createAction(GET_ROBBO_GROUP_BY_ID_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const getRobboGroupsByRobboUnitIdRequest = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID, (token, robboUnitId) => {
    return {
        token,
        robboUnitId,
    }
})

export const getRobboGroupsByRobboUnitIdSuccess = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_SUCCESS, response => {
    return {
        response,
    }
})

export const getRobboGroupsByRobboUnitIdFailed = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID_FAILED, err => {
    return {
        err,
    }
})

export const createRobboGroupRequest = createAction(CREATE_ROBBO_GROUP, (token, robboUnitId, robboGroup) => {
    return {
        token,
        robboUnitId,
        robboGroup,
    }
})

export const createRobboGroupSuccess = createAction(CREATE_ROBBO_GROUP_SUCCESS, (response, robboGroup) => {
    toast.success("Группа создана")
    return {
        response,
        robboGroup,
    }
})

export const createRobboGroupFailed = createAction(CREATE_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteRobboGroupRequest = createAction(DELETE_ROBBO_GROUP, (token, robboUnitId, robboGroupId, robboGroupIndex) => {
    return {
        token,
        robboUnitId,
        robboGroupId,
        robboGroupIndex,
    }
})

export const deleteRobboGroupSuccess = createAction(DELETE_ROBBO_GROUP_SUCCESS, (response, robboGroupIndex) => {
    toast.success("Группа удалена")
    return {
        response,
        robboGroupIndex,
    }
})

export const deleteRobboGroupFailed = createAction(DELETE_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const addStudentToRobboGroupRequest = createAction(ADD_STUDENT_TO_ROBBO_GROUP, (token, robboGroup, studentId) => {
    return {
        token,
        robboGroup,
        studentId,
    }
})

export const addStudentToRobboGroupSuccess = createAction(ADD_STUDENT_TO_ROBBO_GROUP_SUCCESS, response => {
    toast.success("Ученик добавлен в группу")
    return {
        response,
    }
})

export const addStudentToRobboGroupFailed = createAction(ADD_STUDENT_TO_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteStudentFromRobboGroupRequest = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP, (token, robboGroupId, studentId) => {
    return {
        token,
        robboGroupId,
        studentId,
    }
})

export const deleteStudentFromRobboGroupSuccess = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP_SUCCESS, response => {
    return {
        response,
    }
})

export const deleteStudentFromRobboGroupFailed = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const setTeacherForRobboGroupRequest = createAction(SET_TEACHER_FOR_ROBBO_GROUP, (token, teacherId, robboGroupId) => {
    return {
        token,
        teacherId,
        robboGroupId,
    }
})

export const setTeacherForRobboGroupSuccess = createAction(SET_TEACHER_FOR_ROBBO_GROUP_SUCCESS, response => {
    toast.success("Педагог успешно назначен")
    return {
        response,
    }
})

export const setTeacherForRobboGroupFailed = createAction(SET_TEACHER_FOR_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteTeacherForRobboGroupRequest = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP, (token, teacherId, robboGroupId) => {
    return {
        token,
        teacherId,
        robboGroupId,
    }
})

export const deleteTeacherForRobboGroupSuccess = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP_SUCCESS, response => {
    toast.success("Педагог успешно отстранен")
    return {
        response,
    }
})

export const deleteTeacherForRobboGroupFailed = createAction(DELETE_TEACHER_FOR_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const searchRobboGroupsByTitleRequest = createAction(SEARCH_ROBBO_GROUP_BY_TITLE, (token, title) => {
    return {
        token,
        title,
    }
})

export const searchRobboGroupsByTitleSuccess = createAction(SEARCH_ROBBO_GROUP_BY_TITLE_SUCCESS, response => {
    return {
        response,
    }
})

export const searchRobboGroupsByTitleFailed = createAction(SEARCH_ROBBO_GROUP_BY_TITLE_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const getRobboGroupsByAccessToken = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN)

export const getRobboGroupsByAccessTokenSuccess = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_SUCCESS, response => {
    return {
        response,
    }
})

export const getRobboGroupsByAccessTokenFailed = createAction(GET_ROBBO_GROUPS_BY_ACCESS_TOKEN_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const getAllRobboGroups = createAction(GET_ALL_ROBBO_GROUPS)
export const getAllRobboGroupsSuccess = createAction(GET_ALL_ROBBO_GROUPS_SUCCESS, response => (
    {
        response,
    }
))
export const getAllRobboGroupsFailed = createAction(GET_ALL_ROBBO_GROUPS_FAILED, err => ({ err }))

export const updateRobboGroup = createAction(UPDATE_ROBBO_GROUP, robboGroup => robboGroup)
export const updateRobboGroupSuccess = createAction(UPDATE_ROBBO_GROUP_SUCCESS, response => response)
export const updateRobboGroupFailed = createAction(UPDATE_ROBBO_GROUP_FAILED, err => err)
