import { handleActions } from 'redux-actions'

import {
    getCoursePageById,
    getCoursePageByIdFailed,
    getCoursePageByIdSuccess,
    clearCoursePageState,
    createCourseAccessRelationStudentRequest,
    createCourseAccessRelationStudentSuccess,
    createCourseAccessRelationStudentFailed,
    deleteCourseAccessRelationStudentRequest,
    deleteCourseAccessRelationStudentSuccess,
    deleteCourseAccessRelationStudentFailed,
    createCourseAccessRelationTeacherRequest,
    createCourseAccessRelationTeacherSuccess,
    createCourseAccessRelationTeacherFailed,
    createCourseAccessRelationUnitAdminRequest,
    createCourseAccessRelationUnitAdminSuccess,
    createCourseAccessRelationUnitAdminFailed,
    createCourseAccessRelationRobboUnitRequest,
    createCourseAccessRelationRobboUnitSuccess,
    createCourseAccessRelationRobboUnitFailed,
    createCourseAccessRelationRobboGroupRequest,
    createCourseAccessRelationRobboGroupSuccess,
    createCourseAccessRelationRobboGroupFailed,
} from '@/actions'

const INITIAL_STATE = {
    loading: true,
    coursePage: {},
}

export default handleActions({
    [getCoursePageById](state, action) {
        return { ...state, loading: true }
    },
    [getCoursePageByIdFailed](state, action) {
        return { ...state, loading: false }
    },
    [getCoursePageByIdSuccess](state, action) {
        return { ...state, coursePage: action.payload.course, loading: false }
    },
    [clearCoursePageState](state, action) {
        return INITIAL_STATE
    },
    [createCourseAccessRelationStudentRequest](state) {
        return { ...state, loading: true }
    },
    [createCourseAccessRelationStudentSuccess](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationStudentFailed](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationTeacherRequest](state) {
        return { ...state, loading: true }
    },
    [createCourseAccessRelationTeacherSuccess](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationTeacherFailed](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationUnitAdminRequest](state) {
        return { ...state, loading: true }
    },
    [createCourseAccessRelationUnitAdminSuccess](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationUnitAdminFailed](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationRobboUnitRequest](state) {
        return { ...state, loading: true }
    },
    [createCourseAccessRelationRobboUnitSuccess](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationRobboUnitFailed](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationRobboGroupRequest](state) {
        return { ...state, loading: true }
    },
    [createCourseAccessRelationRobboGroupSuccess](state) {
        return { ...state, loading: false }
    },
    [createCourseAccessRelationRobboGroupFailed](state) {
        return { ...state, loading: false }
    },
    [deleteCourseAccessRelationStudentRequest](state) {
        return { ...state, loading: true }
    },
    [deleteCourseAccessRelationStudentSuccess](state) {
        return { ...state, loading: false }
    },
    [deleteCourseAccessRelationStudentFailed](state) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getCoursePage = state => state.coursePage
export const getCoursePageLoading = state => state.loading