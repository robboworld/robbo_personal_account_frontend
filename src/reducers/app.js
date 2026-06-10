import { handleActions } from 'redux-actions'

import { changeLanguage } from '@/actions'
import { DEFAULT_LANGUAGE, readStoredLanguage, storeLanguage } from '@/helpers/intl'

const storedLanguage = readStoredLanguage()

const INITIAL_STATE = {
    language: storedLanguage || DEFAULT_LANGUAGE,
    locale: storedLanguage || DEFAULT_LANGUAGE,
}

export default handleActions({
    [changeLanguage](state, { payload }) {
        const language = payload.language || DEFAULT_LANGUAGE
        storeLanguage(language)
        return { ...state, language, locale: language }
    },
}, INITIAL_STATE)

export const getAppState = state => state