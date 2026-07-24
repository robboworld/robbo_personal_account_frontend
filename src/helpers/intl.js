import { createIntl, createIntlCache } from 'react-intl'

import RuMessages from '@/lang/ru.json'
import EngMessages from '@/lang/en.json'
import ZhMessages from '@/lang/zh.json'

const intlCache = createIntlCache()

const MESSAGES_BY_LANG = {
  ru: RuMessages,
  en: EngMessages,
  zh: ZhMessages,
}

export const SUPPORTED_LANGUAGES = ['ru', 'en', 'zh']
export const DEFAULT_LANGUAGE = 'ru'
export const LANGUAGE_STORAGE_KEY = 'lk-language'

export function getMessagesForLanguage(language) {
  return MESSAGES_BY_LANG[language] || MESSAGES_BY_LANG[DEFAULT_LANGUAGE]
}

export function getIntlForLanguage(language) {
  const locale = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE
  return createIntl(
    {
      locale,
      messages: getMessagesForLanguage(locale),
      defaultLocale: DEFAULT_LANGUAGE,
    },
    intlCache,
  )
}

export function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE
  }
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function storeLanguage(language) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    /* ignore */
  }
}

export function formatMessageForLanguage(language, descriptor, values) {
  return getIntlForLanguage(language).formatMessage(descriptor, values)
}

export function formatMessageId(language, id, values) {
  return formatMessageForLanguage(language, { id }, values)
}

const DEFAULT_TITLE_SENTINELS = new Set(['untitled', 'безымянный', '未命名', 'без названия'])

/**
 * Localized project title for list/detail UI.
 * Empty titles and known default-name sentinels map to project_page.untitled.
 */
export function displayProjectTitle(title, intl) {
  const trimmed = typeof title === 'string' ? title.trim() : ''
  if (!trimmed || DEFAULT_TITLE_SENTINELS.has(trimmed.toLowerCase())) {
    return intl.formatMessage({ id: 'project_page.untitled' })
  }
  return trimmed
}

