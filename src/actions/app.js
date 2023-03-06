import { createAction } from 'redux-actions'

import { CHANGE_LANGUAGE } from '@/constants'

export const changeLanguage = createAction(CHANGE_LANGUAGE, language => ({ language }))
