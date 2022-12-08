import { handleActions } from 'redux-actions'

import { getCoursePageById, getCoursePageByIdFailed, getCoursePageByIdSuccess, clearCoursePageState } from '@/actions'

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
}, INITIAL_STATE)

export const getCoursePage = state => state.coursePage
export const getCoursePageLoading = state => state.loading