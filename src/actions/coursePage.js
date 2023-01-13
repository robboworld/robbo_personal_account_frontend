import { createAction } from 'redux-actions'
import { toast } from 'react-toastify'

import {
    GET_ALL_COURSE_PAGES,
    GET_ALL_COURSE_PAGES_SUCCESS,
    GET_ALL_COURSE_PAGES_FAILED,
    GET_COURSE_PAGE_BY_ID,
    GET_COURSE_PAGE_BY_ID_SUCCESS,
    GET_COURSE_PAGE_BY_ID_FAILED,
    CLEAR_COURSE_PAGE_STATE,
    CLEAR_ALL_COURSE_PAGES_STATE,
    CREATE_ACCESS_COURSE_RELATION_STUDENT_FAILED,
    CREATE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    CREATE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS,
    GET_COURSE_PAGES_FOR_STUDENT_REQUEST,
    GET_COURSE_PAGES_FOR_STUDENT_FAILED,
    GET_COURSE_PAGES_FOR_STUDENT_SUCCESS,
    DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS,
    DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED,
    GET_COURSE_PAGES_BY_USER_REQUEST,
    GET_COURSE_PAGES_BY_USER_SUCCESS,
    GET_COURSE_PAGES_BY_USER_FAILED,
} from '@/constants'

export const getAllCoursePages = createAction(GET_ALL_COURSE_PAGES, token => {
    return {
        token,
    }
})

export const getAllCoursePagesSuccess = createAction(GET_ALL_COURSE_PAGES_SUCCESS, courses => {
    return {
        courses,
    }
})

export const getAllCoursePagesFailed = createAction(GET_ALL_COURSE_PAGES_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})


export const getCoursePageById = createAction(GET_COURSE_PAGE_BY_ID, (token, id) => {
    return {
        token,
        id,
    }
})

export const getCoursePageByIdSuccess = createAction(GET_COURSE_PAGE_BY_ID_SUCCESS, course => {
    return {
        course,
    }
})

export const getCoursePageByIdFailed = createAction(GET_COURSE_PAGE_BY_ID_FAILED, err => {
    toast.error(err)
    return {
        err,
    }
})

export const createCourseAccessRelationStudentRequest = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, studentId) => ({ courseId, studentId }))
export const createCourseAccessRelationStudentSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const createCourseAccessRelationStudentFailed = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const getCoursePagesForStudentRequest = createAction(GET_COURSE_PAGES_FOR_STUDENT_REQUEST)
export const getCoursePagesForStudentSuccess = createAction(GET_COURSE_PAGES_FOR_STUDENT_SUCCESS, response => ({ response }))
export const getCoursePagesForStudentFailed = createAction(GET_COURSE_PAGES_FOR_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationStudentRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, studentId) => ({ courseId, studentId }))
export const deleteCourseAccessRelationStudentSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationStudentFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const getCoursePagesByUserRequest = createAction(GET_COURSE_PAGES_BY_USER_REQUEST)
export const getCoursePagesByUserSuccess = createAction(GET_COURSE_PAGES_BY_USER_SUCCESS, response => ({ response }))
export const getCoursePagesByUserFailed = createAction(GET_COURSE_PAGES_BY_USER_FAILED, err => ({ err }))

export const clearCoursePageState = createAction(CLEAR_COURSE_PAGE_STATE)
export const clearAllCoursePagesState = createAction(CLEAR_ALL_COURSE_PAGES_STATE)