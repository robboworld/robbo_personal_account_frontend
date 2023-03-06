import { createAction } from 'redux-actions'

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
    CREATE_ACCESS_COURSE_RELATION_TEACHER_REQUEST,
    CREATE_ACCESS_COURSE_RELATION_TEACHER_SUCCESS,
    CREATE_ACCESS_COURSE_RELATION_TEACHER_FAILED,
    CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_REQUEST,
    CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_SUCCESS,
    CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_FAILED,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_REQUEST,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_SUCCESS,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_FAILED,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_REQUEST,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_SUCCESS,
    CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_FAILED,
    GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_REQUEST,
    GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_SUCCESS,
    GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_FAILED,
    GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_REQUEST,
    GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_SUCCESS,
    GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_FAILED,
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

export const createCourseAccessRelationStudentRequest = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, studentId) => ({ courseId, studentId }))
export const createCourseAccessRelationStudentSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const createCourseAccessRelationStudentFailed = createAction(CREATE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const createCourseAccessRelationTeacherRequest = createAction(CREATE_ACCESS_COURSE_RELATION_TEACHER_REQUEST,
    (courseId, teacherId) => ({ courseId, teacherId }))
export const createCourseAccessRelationTeacherSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_TEACHER_SUCCESS, response => ({ response }))
export const createCourseAccessRelationTeacherFailed = createAction(CREATE_ACCESS_COURSE_RELATION_TEACHER_FAILED, err => ({ err }))

export const createCourseAccessRelationUnitAdminRequest = createAction(CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_REQUEST,
    (courseId, unitAdminId) => ({ courseId, unitAdminId }))
export const createCourseAccessRelationUnitAdminSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_SUCCESS, response => ({ response }))
export const createCourseAccessRelationUnitAdminFailed = createAction(CREATE_ACCESS_COURSE_RELATION_UNIT_ADMIN_FAILED, err => ({ err }))

export const createCourseAccessRelationRobboGroupRequest = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_REQUEST,
    (courseId, robboGroupId) => ({ courseId, robboGroupId }))
export const createCourseAccessRelationRobboGroupSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_SUCCESS, response => ({ response }))
export const createCourseAccessRelationRobboGroupFailed = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_GROUP_FAILED, err => ({ err }))

export const createCourseAccessRelationRobboUnitRequest = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_REQUEST,
    (courseId, robboUnitId) => ({ courseId, robboUnitId }))
export const createCourseAccessRelationRobboUnitSuccess = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_SUCCESS, response => ({ response }))
export const createCourseAccessRelationRobboUnitFailed = createAction(CREATE_ACCESS_COURSE_RELATION_ROBBO_UNIT_FAILED, err => ({ err }))


export const getCoursePagesForStudentRequest = createAction(GET_COURSE_PAGES_FOR_STUDENT_REQUEST)
export const getCoursePagesForStudentSuccess = createAction(GET_COURSE_PAGES_FOR_STUDENT_SUCCESS, response => ({ response }))
export const getCoursePagesForStudentFailed = createAction(GET_COURSE_PAGES_FOR_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationStudentRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, studentId) => ({ courseId, studentId }))
export const deleteCourseAccessRelationStudentSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationStudentFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationTeacherRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, teacherId) => ({ courseId, teacherId }))
export const deleteCourseAccessRelationTeacherSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationTeacherFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationUnitAdminRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, unitAdminId) => ({ courseId, unitAdminId }))
export const deleteCourseAccessRelationUnitAdminSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationUnitAdminFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationRobboUnitRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, robboUnitId) => ({ courseId, robboUnitId }))
export const deleteCourseAccessRelationRobboUnitSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationRobboUnitFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))

export const deleteCourseAccessRelationRobboGroupRequest = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_REQUEST,
    (courseId, robboGroupId) => ({ courseId, robboGroupId }))
export const deleteCourseAccessRelationRobboGroupSuccess = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_SUCCESS, response => ({ response }))
export const deleteCourseAccessRelationRobboGroupFailed = createAction(DELETE_ACCESS_COURSE_RELATION_STUDENT_FAILED, err => ({ err }))


export const getCoursePagesByUserRequest = createAction(GET_COURSE_PAGES_BY_USER_REQUEST)
export const getCoursePagesByUserSuccess = createAction(GET_COURSE_PAGES_BY_USER_SUCCESS, response => ({ response }))
export const getCoursePagesByUserFailed = createAction(GET_COURSE_PAGES_BY_USER_FAILED, err => ({ err }))

export const getCoursePagesByRobboUnitIdRequest = createAction(GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_REQUEST,
    (robboUnitId, page, pageSize) => ({ robboUnitId, page, pageSize }))
export const getCoursePagesByRobboUnitIdSuccess = createAction(GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_SUCCESS, response => ({ response }))
export const getCoursePagesByRobboUnitIdFailed = createAction(GET_COURSE_PAGES_BY_ROBBO_UNIT_ID_FAILED, err => ({ err }))

export const getCoursePagesByRobboGroupIdRequest = createAction(GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_REQUEST,
    (robboGroupId, page, pageSize) => ({ robboGroupId, page, pageSize }))
export const getCoursePagesByRobboGroupIdSuccess = createAction(GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_SUCCESS, response => ({ response }))
export const getCoursePagesByRobboGroupIdFailed = createAction(GET_COURSE_PAGES_BY_ROBBO_GROUP_ID_FAILED, err => ({ err }))

export const clearCoursePageState = createAction(CLEAR_COURSE_PAGE_STATE)
export const clearAllCoursePagesState = createAction(CLEAR_ALL_COURSE_PAGES_STATE)