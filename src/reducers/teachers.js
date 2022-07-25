import { handleActions } from "redux-actions"

const INITIAL_STATE = {
    teachers: [
        {
            id: 1,
            email: 'rupychman@mail.ru',
            nickname: 'skinnykaen',
            joinedAt: "10.05.2022",
            avatar: null,
            role: 'Педагог',
            firstname: 'Ксения',
            lastname: 'Клещенок',
            middlename: 'Артуровна',
        },
        {
            id: 2,
            email: 'rupychman@mail.ru',
            nickname: 'skinnykaen',
            joinedAt: "10.05.2022",
            avatar: null,
            role: 'Педагог',
            firstname: 'Евгений',
            lastname: 'Сущевич',
            middlename: 'Павлович',
        },
    ],
    loading: false,
}

export default handleActions({

    // [clearProjectPageState](state, action) {
    //     return { ...state, loading: false, projectPage: {} }
    // },
}, INITIAL_STATE)

export const getTeachersState = state => state