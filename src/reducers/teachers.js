import { handleActions } from 'redux-actions'

import { clearTeachersState, getTeachers, getTeachersFailed, getTeachersSuccess } from "@/actions"

const INITIAL_STATE = {
    teachers: [],
    loading: false,
}

export default handleActions({
    [getTeachers](state) {
        return { ...state, loading: true }
    },
    [getTeachersSuccess](state, action) {
        console.log(action)
        return { ...state, teachers: action.payload.response, loading: false }
    },
    [getTeachersFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearTeachersState](state, action) {
        return { ...state, loading: false, teachers: [] }
    },
}, INITIAL_STATE)

export const getTeachersState = state => state