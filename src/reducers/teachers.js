import { handleActions } from 'redux-actions'

import { clearTeachersState, deleteTeacher, deleteTeacherFailed, deleteTeacherSuccess, getTeachers, getTeachersFailed, getTeachersSuccess } from "@/actions"

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
    [deleteTeacher](state) {
        return { ...state, loading: true }
    },
    [deleteTeacherSuccess](state, action) {
        const { teachetIndex } = action.payload
        const newTeachers = [...state.teachers]
        newTeachers.splice(teachetIndex, 1)
        return { ...state, loading: false, teachers: newTeachers }
    },
    [deleteTeacherFailed](state, action) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getTeachersState = state => state