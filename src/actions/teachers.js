import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import { GET_TEACHERS } from '@/constants/sagas/teachers'
import { CLEAR_TEACHERS_STATE, GET_TEACHERS_FAILED, GET_TEACHERS_SUCCESS } from '@/constants'

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

export const clearTeachersState = createAction(CLEAR_TEACHERS_STATE)