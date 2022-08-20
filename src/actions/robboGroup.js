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
} from "@/constants"

export const getRobboGroupByIdRequest = createAction(GET_ROBBO_GROUP_BY_ID, (robboUnitId, robboGroupId) => {
    return {
        robboUnitId,
        robboGroupId,
    }
})

export const getRobboGroupByIdSuccess = createAction(GET_ROBBO_GROUP_BY_ID, response => {
    return {
        response,
    }
})

export const getRobboGroupByIdFailed = createAction(GET_ROBBO_GROUP_BY_ID, err => {
    toast.error(err)
    return {
        err,
    }
})

export const getRobboGroupsByRobboUnitIdRequest = createAction(GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID, robboUnitId => {
    return {
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

export const createRobboGroupRequest = createAction(CREATE_ROBBO_GROUP, robboUnitId => {
    return {
        robboUnitId,
    }
})

export const createRobboGroupSuccess = createAction(CREATE_ROBBO_GROUP, response => {
    return {
        response,
    }
})

export const createRobboGroupFailed = createAction(CREATE_ROBBO_GROUP, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteRobboGroupRequest = createAction(DELETE_ROBBO_GROUP, (robboUnitId, robboGroupId, robboGroupIndex) => {
    return {
        robboUnitId,
        robboGroupId,
        robboGroupIndex,
    }
})

export const deleteRobboGroupSuccess = createAction(DELETE_ROBBO_GROUP_SUCCESS, response => {
    return {
        response,
    }
})

export const deleteRobboGroupFailed = createAction(DELETE_ROBBO_GROUP_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const addStudentToRobboGroupRequest = createAction(ADD_STUDENT_TO_ROBBO_GROUP, (robboGroupId, studentId) => {
    return {
        robboGroupId,
        studentId,
    }
})

export const addStudentToRobboGroupSuccess = createAction(ADD_STUDENT_TO_ROBBO_GROUP_SUCCESS, response => {
    return {
        response,
    }
})

export const addStudentToRobboGroupFailed = createAction(ADD_STUDENT_TO_ROBBO_GROUP_SUCCESS, err => {
    toast.error(err)
    return {
        err,
    }
})

export const deleteStudentFromRobboGroupRequest = createAction(DELETE_STUDENT_FROM_ROBBO_GROUP, (robboGroupId, studentId) => {
    return {
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