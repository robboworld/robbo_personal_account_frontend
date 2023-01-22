import { handleActions } from 'redux-actions'

import {
    clearTeachersState,
    createTeacher,
    createTeacherFailed,
    createTeacherSuccess,
    deleteTeacher,
    deleteTeacherFailed,
    deleteTeacherForRobboGroupFailed,
    deleteTeacherForRobboGroupRequest,
    deleteTeacherForRobboGroupSuccess,
    deleteTeacherSuccess,
    getTeachers,
    getTeachersFailed,
    getTeachersSuccess,
    setTeacherForRobboGroupFailed,
    setTeacherForRobboGroupRequest,
    setTeacherForRobboGroupSuccess,
} from "@/actions"

const INITIAL_STATE = {
    teachers: [],
    teacherRobboGroups: [],
    loading: true,
}

export default handleActions({
    [getTeachers](state) {
        return { ...state, loading: true }
    },
    [getTeachersSuccess](state, action) {
        return { ...state, teachers: action.payload.response, loading: false }
    },
    [getTeachersFailed](state, action) {
        return { ...state, loading: false }
    },
    [clearTeachersState](state, action) {
        return INITIAL_STATE
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
        const { response } = action.payload
        return {
            ...state,
            loading: false,
            teachers: [...state.teachers, { userHttp: { ...response.userHttp } }],
        }
    },
    [createTeacherFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
    [setTeacherForRobboGroupRequest](state, action) {
        return {
            ...state, loading: true,
        }
    },
    [setTeacherForRobboGroupSuccess](state, action) {
        return {
            ...state, loading: false,
        }
    },
    [setTeacherForRobboGroupFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
    [deleteTeacherForRobboGroupRequest](state) {
        return {
            ...state, loading: true,
        }
    },
    [deleteTeacherForRobboGroupSuccess](state, action) {
        return {
            ...state, loading: false,
        }
    },
    [deleteTeacherForRobboGroupFailed](state, action) {
        return {
            ...state, loading: false,
        }
    },
}, INITIAL_STATE)

export const getTeachersState = state => state