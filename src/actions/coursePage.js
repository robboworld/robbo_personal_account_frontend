import { createAction } from 'redux-actions'

import {
    GET_ALL_COURSE_PAGES, GET_ALL_COURSE_PAGES_SUCCESS, GET_ALL_COURSE_PAGES_FAILED,
    GET_COURSE_PAGE_BY_ID, GET_COURSE_PAGE_BY_ID_SUCCESS, GET_COURSE_PAGE_BY_ID_FAILED,
    CLEAR_COURSE_PAGE_STATE, CLEAR_ALL_COURSE_PAGES_STATE,
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
    return {
        err,
    }
})

export const clearCoursePageState = createAction(CLEAR_COURSE_PAGE_STATE)
export const clearAllCoursePagesState = createAction(CLEAR_ALL_COURSE_PAGES_STATE)