import { handleActions } from 'redux-actions'

import { clearProfileState, deleteProfile, deleteProfileFailed, deleteProfileSuccess, getProfileById, getProfileByIdFailed, getProfileByIdSuccess, profileEmailOnChange } from '@/actions/profile'

const INITIAL_STATE = {
    id: null,
    email: 'rupychman@mail.ru',
    joinedAt: "10.05.2022",
    avatar: null,
    role: 'Ученик',
    // aboutMe: "",
    // workingOn: "",
    // informationTrail: "",
    loading: false,
}

export default handleActions({
    [profileEmailOnChange](state, action) {
        return { ...state, email: action.payload.email }
    },
    [clearProfileState](state) {
        return { ...state, id: null, email: null, joinedAt: null, role: null, loading: false }
    },
    [getProfileById](state) {
        return { ...state, loading: true }
    },
    [getProfileByIdSuccess](state, action) {
        return { ...state, loading: false }
    },
    [getProfileByIdFailed](state, action) {
        return { ...state, loading: false }
    },
    [deleteProfile](state) {
        return { ...state, loading: true }
    },
    [deleteProfileSuccess](state, action) {
        return { ...state, loading: false }
    },
    [deleteProfileFailed](state, action) {
        return { ...state, loading: false }
    },
}, INITIAL_STATE)

export const getProfile = state => state
export const getProfileLoading = state => state.loading