import { createAction } from "redux-actions"

import { 
    GET_ALL_COURSE_PAGES, GET_ALL_COURSE_PAGES_SUCCESS, GET_ALL_COURSE_PAGES_FAILED,
    GET_COURSE_PAGE_BY_ID, GET_COURSE_PAGE_BY_ID_SUCCESS, GET_COURSE_PAGE_BY_ID_FAILED,
} from "@/constants"

export const getAllCoursePages = createAction(GET_ALL_COURSE_PAGES, token => {
    return {
        token,
    }
})

export const getAllCoursePagesSuccess = createAction(GET_ALL_COURSE_PAGES_SUCCESS, () => {
    return {

    }
})

export const getAllCoursePagesFailed = createAction(GET_ALL_COURSE_PAGES_FAILED, () => {
    return {

    }
})


export const getCoursePageById = createAction(GET_COURSE_PAGE_BY_ID, () => {
    return {

    }
})

export const getCoursePageByIdSuccess = createAction(GET_COURSE_PAGE_BY_ID_SUCCESS, () => {
    return {

    }
})

export const getCoursePageByIdFailed = createAction(GET_COURSE_PAGE_BY_ID_FAILED, () => {
    return {

    }
})