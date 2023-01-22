import { handleActions } from 'redux-actions'

import {
    getAllCoursePagesSuccess,
    getAllCoursePagesFailed,
    clearAllCoursePagesState,
    getAllCoursePages,
    getCoursePagesByUserRequest,
    getCoursePagesByUserSuccess,
    getCoursePagesByUserFailed,
} from '@/actions'

const INITIAL_STATE = {
    loading: true,
    coursePages: [],
}

export default handleActions({
    [getAllCoursePages](state) {
        return { ...state, loading: true }
    },
    [getAllCoursePagesSuccess](state, action) {
        return { ...state, coursePages: action.payload.courses, loading: false }
    },
    [getAllCoursePagesFailed](state, action) {
        return { ...state, loading: false }
    },
    [getCoursePagesByUserRequest](state, action) {
        return { ...state, loading: true }
    },
    [getCoursePagesByUserSuccess](state, action) {
        return { ...state, coursePages: action.payload.response, loading: false }
    },
    [getCoursePagesByUserFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearAllCoursePagesState](state, action) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getCoursePagesState = state => state
export const getCoursePages = state => state.coursePages
export const getCoursePagesLoading = state => state.loading