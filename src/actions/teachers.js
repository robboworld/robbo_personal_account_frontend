import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import { DELETE_TEACHER, GET_TEACHERS } from '@/constants/sagas/teachers'
import { CLEAR_TEACHERS_STATE, DELETE_TEACHER_FAILED, DELETE_TEACHER_SUCCESS, GET_TEACHERS_FAILED, GET_TEACHERS_SUCCESS } from '@/constants'

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

export const clearTeachersState = createAction(CLEAR_TEACHERS_STATE)