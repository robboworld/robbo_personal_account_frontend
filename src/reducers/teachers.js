import { handleActions } from "redux-actions"

const INITIAL_STATE = {
    teachers: [],
    loading: false,
}

export default handleActions({

    // [clearProjectPageState](state, action) {
    //     return { ...state, loading: false, projectPage: {} }
    // },
}, INITIAL_STATE)

export const getTeachersState = state => state