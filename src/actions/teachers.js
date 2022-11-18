import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import { CREATE_TEACHER, DELETE_TEACHER, GET_ROBBO_GROUPS_BY_TEACHER_ID, GET_TEACHERS } from '@/constants/sagas/teachers'
import {
    CLEAR_TEACHERS_STATE, CREATE_TEACHER_FAILED,
    CREATE_TEACHER_SUCCESS, DELETE_TEACHER_FAILED,
    DELETE_TEACHER_SUCCESS, GET_ROBBO_GROUPS_BY_TEACHER_ID_FAILED, GET_ROBBO_GROUPS_BY_TEACHER_ID_SUCCESS, GET_TEACHERS_FAILED,
    GET_TEACHERS_SUCCESS,
} from '@/constants'

export const getTeachers = createAction(GET_TEACHERS, token => {
    return {
        token,
    }
})

export const getTeachersSuccess = createAction(GET_TEACHERS_SUCCESS, response => {
    return {
        response,
    }
})

export const getTeachersFailed = createAction(GET_TEACHERS_FAILED, err => {
    toast.error('Не удалось выполнить запрос!')
    return {
        err,
    }
})

export const deleteTeacher = createAction(DELETE_TEACHER, (token, teacherId, teacherIndex) => {
    return {
        token,
        teacherId,
        teacherIndex,
    }
})

export const deleteTeacherSuccess = createAction(DELETE_TEACHER_SUCCESS, (response, teacherIndex) => {
    toast.success("Учитель успешно удален!")
    return {
        response,
        teacherIndex,
    }
})

export const deleteTeacherFailed = createAction(DELETE_TEACHER_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const createTeacher = createAction(CREATE_TEACHER, (token, teacher) => {
    return {
        token,
        teacher,
    }
})

export const createTeacherSuccess = createAction(CREATE_TEACHER_SUCCESS, (response, teacher) => {
    toast.success("Педагог успешно создан!")
    return {
        response,
        teacher,
    }
})

export const createTeacherFailed = createAction(CREATE_TEACHER_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const clearTeachersState = createAction(CLEAR_TEACHERS_STATE)

export const getRobboGroupsByTeacherId = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID, teacherId => {
    return {
        teacherId,
    }
})

export const getRobboGroupsByTeacherIdSuccess = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID_SUCCESS, response => {
    return {
        response,
    }
})

export const getRobboGroupsByTeacherIdFailed = createAction(GET_ROBBO_GROUPS_BY_TEACHER_ID_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})