import countries from 'i18n-iso-countries'
import languages from '@cospired/i18n-iso-languages'

import countriesEn from 'i18n-iso-countries/langs/en.json'
import countriesRu from 'i18n-iso-countries/langs/ru.json'
import countriesZh from 'i18n-iso-countries/langs/zh.json'
import languagesEn from '@cospired/i18n-iso-languages/langs/en.json'
import languagesRu from '@cospired/i18n-iso-languages/langs/ru.json'
import languagesZh from '@cospired/i18n-iso-languages/langs/zh.json'

countries.registerLocale(countriesEn)
countries.registerLocale(countriesRu)
countries.registerLocale(countriesZh)
languages.registerLocale(languagesEn)
languages.registerLocale(languagesRu)
languages.registerLocale(languagesZh)

const currentYear = new Date().getFullYear()

const EDUCATION_VALUES = ['p', 'm', 'b', 'a', 'hs', 'jhs', 'el', 'other']
const GENDER_VALUES = ['m', 'f']

const PACKAGE_LOCALES = {
  en: 'en',
  ru: 'ru',
  zh: 'zh',
}

function resolvePackageLocale(intlLocale) {
  const [base] = String(intlLocale || 'en').toLowerCase().split('-')
  return PACKAGE_LOCALES[base] || 'en'
}

function mapOptions(intl, values, labelPrefix, placeholderId) {
  const placeholder = intl.formatMessage({ id: placeholderId })
  return [
    { value: '', label: placeholder },
    ...values.map(value => ({
      value,
      label: intl.formatMessage({ id: `${labelPrefix}.${value}` }),
    })),
  ]
}

/** Russia → CIS → China → rest (A–Z by label). */
const PRIORITY_COUNTRY_CODES = [
  'RU',
  // CIS (excluding RU)
  'BY', 'KZ', 'AM', 'AZ', 'KG', 'MD', 'TJ', 'UZ', 'TM',
  'CN',
]

/** Russian → CIS languages → Chinese → rest (A–Z by label). */
const PRIORITY_LANGUAGE_CODES = [
  'ru',
  // CIS (excluding Russian): BY, KZ, AM, AZ, KG, MD, TJ, UZ, TM
  'be', 'kk', 'hy', 'az', 'ky', 'ro', 'tg', 'uz', 'tk',
  'zh',
]

function mapNamesToOptionsWithPriority(names, placeholder, priorityCodes) {
  const priorityRank = new Map(
    priorityCodes.map((code, index) => [code, index]),
  )
  const options = Object.entries(names).map(([code, name]) => ({
    value: code,
    label: name,
  }))

  options.sort((a, b) => {
    const aRank = priorityRank.has(a.value) ? priorityRank.get(a.value) : Infinity
    const bRank = priorityRank.has(b.value) ? priorityRank.get(b.value) : Infinity
    if (aRank !== bRank) {
      return aRank - bRank
    }
    return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
  })

  return [{ value: '', label: placeholder }, ...options]
}

export function getEducationLevelOptions(intl) {
  return mapOptions(
    intl,
    EDUCATION_VALUES,
    'lms_options.education',
    'profile_card.level_of_education_placeholder',
  )
}

export function getGenderOptions(intl) {
  return mapOptions(
    intl,
    GENDER_VALUES,
    'lms_options.gender',
    'profile_card.gender_placeholder',
  )
}

export function getCountryOptions(intl) {
  const locale = resolvePackageLocale(intl.locale)
  const names = countries.getNames(locale) || countries.getNames('en') || {}
  return mapNamesToOptionsWithPriority(
    names,
    intl.formatMessage({ id: 'profile_card.country_placeholder' }),
    PRIORITY_COUNTRY_CODES,
  )
}

export function getSpokenLanguageOptions(intl) {
  const locale = resolvePackageLocale(intl.locale)
  const names = languages.getNames(locale) || languages.getNames('en') || {}
  return mapNamesToOptionsWithPriority(
    names,
    intl.formatMessage({ id: 'profile_card.language_placeholder' }),
    PRIORITY_LANGUAGE_CODES,
  )
}

export function getYearOfBirthOptions(intl) {
  const placeholder = intl.formatMessage({ id: 'profile_card.year_of_birth_placeholder' })
  return [
    { value: '', label: placeholder },
    ...Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
      const year = currentYear - i
      return { value: year, label: String(year) }
    }),
  ]
}

/** Keep a saved value visible in Select when it is no longer in the canonical list. */
export function withOrphanOption(options, currentValue) {
  if (currentValue === undefined || currentValue === null || currentValue === '') {
    return options
  }
  const value = String(currentValue)
  if (options.some(option => String(option.value) === value)) {
    return options
  }
  return [...options, { value, label: value }]
}

export function getLmsProfileOptions(intl) {
  return {
    educationLevelOptions: getEducationLevelOptions(intl),
    genderOptions: getGenderOptions(intl),
    countryOptions: getCountryOptions(intl),
    spokenLanguageOptions: getSpokenLanguageOptions(intl),
    yearOfBirthOptions: getYearOfBirthOptions(intl),
  }
}
