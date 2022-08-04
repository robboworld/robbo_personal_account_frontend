import { handleActions } from 'redux-actions'

import { clearTeachersState, createTeacher, createTeacherFailed, createTeacherSuccess, deleteTeacher, deleteTeacherFailed, deleteTeacherSuccess, getTeachers, getTeachersFailed, getTeachersSuccess } from "@/actions"

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
        const { teacherIndex } = action.payload
        const newTeachers = [...state.teachers]
        newTeachers.splice(teacherIndex, 1)
        return { ...state, loading: false, teachers: newTeachers }
    },
    [deleteTeacherFailed](state, action) {
        return { ...state, loading: false }
    },
    [createTeacher](state) {
        return { ...state, loading: true }
    },
    [createTeacherSuccess](state, action) {
        const { response, teacher } = action.payload
        return {
            ...state,
            loading: false,
            teachers: [...state.teachers, { userHttp: { id: response.teacherId, ...teacher } }],
        }
    },
    [createTeacherFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
}, INITIAL_STATE)

export const getTeachersState = state => state