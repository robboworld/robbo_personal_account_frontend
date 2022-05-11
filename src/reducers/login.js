import { handleActions } from "redux-actions";

import { emailOnChange, passwordOnChange } from "@/actions";

const INITIAL_STATE = {
    email: '',
    password: '',
}

export default handleActions({
    [emailOnChange](state, action) {
        console.log(action)
        return { ...state, email: action.payload.email }
    },
    [passwordOnChange](state, action) {
        console.log(action)
        return { ...state, password: action.payload.password }
    }
}, INITIAL_STATE);

export const getEmail = state => state.email;
export const getPassword = state => state.password;
