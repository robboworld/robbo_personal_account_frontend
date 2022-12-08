import { handleActions } from 'redux-actions'

import {
    getAllCoursePagesSuccess, getAllCoursePagesFailed, clearAllCoursePagesState,
} from '@/actions'

const INITIAL_STATE = {
    loading: true,
    coursePages: [],
}

export default handleActions({
    [getAllCoursePagesSuccess](state, action) {
        return { ...state, coursePages: action.payload.courses, loading: false }
    },
    [getAllCoursePagesFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearAllCoursePagesState](state, action) {
        return INITIAL_STATE
    },
}, INITIAL_STATE)

export const getCoursePages = state => state.coursePages
export const getCoursePagesLoading = state => state.loading