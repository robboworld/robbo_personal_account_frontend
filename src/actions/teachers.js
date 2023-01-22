import { createAction } from 'redux-actions'


import {
    CREATE_TEACHER,
    DELETE_TEACHER,
    GET_ROBBO_GROUPS_BY_TEACHER_ID,
    GET_TEACHERS,
    CLEAR_TEACHERS_STATE,
    CREATE_TEACHER_FAILED,
    CREATE_TEACHER_SUCCESS,
    DELETE_TEACHER_FAILED,
    DELETE_TEACHER_SUCCESS,
    GET_ROBBO_GROUPS_BY_TEACHER_ID_FAILED,
    GET_ROBBO_GROUPS_BY_TEACHER_ID_SUCCESS,
    GET_TEACHERS_FAILED,
    GET_TEACHERS_SUCCESS,
} from '@/constants'

export const getTeachers = createAction(GET_TEACHERS, (page, pageSize) => ({ page, pageSize }))
export const getTeachersSuccess = createAction(GET_TEACHERS_SUCCESS, response => ({ response }))
export const getTeachersFailed = createAction(GET_TEACHERS_FAILED, err => ({ err }))

export const deleteTeacher = createAction(DELETE_TEACHER, (teacherId, teacherIndex) => ({ teacherId, teacherIndex }))
export const deleteTeacherSuccess = createAction(DELETE_TEACHER_SUCCESS, (response, teacherIndex) => ({ response, teacherIndex }))
export const deleteTeacherFailed = createAction(DELETE_TEACHER_FAILED, err => ({ err }))

export const createTeacher = createAction(CREATE_TEACHER, teacher => ({ teacher }))
export const createTeacherSuccess = createAction(CREATE_TEACHER_SUCCESS, response => ({ response }))
export const createTeacherFailed = createAction(CREATE_TEACHER_FAILED, err => ({ err }))

export const clearTeachersState = createAction(CLEAR_TEACHERS_STATE)

export const getRobboGroupsByTeacherId = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID, (teacherId, page, pageSize) => ({ teacherId, page, pageSize }))
export const getRobboGroupsByTeacherIdSuccess = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID_SUCCESS, response => ({ response }))
export const getRobboGroupsByTeacherIdFailed = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID_FAILED, err => ({ err }))