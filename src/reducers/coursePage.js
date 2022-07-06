import { handleAction, handleActions } from "redux-actions"

import { getCoursePageByIdFailed, getCoursePageByIdSuccess } from "@/actions"

const INITIAL_STATE = {
    coursePage:
    {
        id: '1',
        title: 'Untitled-1',
        date: '2022.07.05',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },

}

export default handleActions({
    [getCoursePageByIdFailed](state, action) {
        return {...state}
    },
    [getCoursePageByIdSuccess](state, action) {
        return {...state}
    }
}, INITIAL_STATE)

export const getCoursePage = state => state.coursePage