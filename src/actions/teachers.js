import { createAction } from 'redux-actions'

import { GET_TEACHERS } from '@/constants/sagas/teachers'

export const getTeachers = createAction(GET_TEACHERS, token => {
    return {
        token,
    }
})

// export const get