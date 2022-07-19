import { handleActions } from 'redux-actions'

import {

} from '@/actions'

const INITIAL_STATE = {
    id: null,
    email: null,
    joinedAt: null,
    avatar: null,
    role: null,
    // aboutMe: "",
    // workingOn: "",
    // informationTrail: "",
    loading: false,
}

export default handleActions({
    // [getProjectPageById](state, action) {
    //     return { ...state, loading: true }
    // },
}, INITIAL_STATE)

export const getProfile = state => state
export const getProfileLoading = state => state.loading