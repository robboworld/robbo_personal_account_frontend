const currentYear = new Date().getFullYear()

const EDUCATION_VALUES = ['p', 'm', 'b', 'a', 'hs', 'jhs', 'el', 'none', 'other']
const GENDER_VALUES = ['m', 'f', 'o']
const COUNTRY_VALUES = [
  'RU', 'BY', 'KZ', 'UA', 'UZ', 'AM', 'AZ', 'GE', 'KG', 'MD', 'TJ', 'TM',
  'IN', 'CN', 'US', 'DE', 'FR', 'GB', 'TR', 'IL', 'AE', 'OTHER',
]
const LANGUAGE_VALUES = [
  'ru', 'en', 'or', 'hi', 'zh-cn', 'de', 'fr', 'es', 'ar', 'tr', 'kk', 'uk', 'uz', 'other',
]

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
  return mapOptions(
    intl,
    COUNTRY_VALUES,
    'lms_options.country',
    'profile_card.country_placeholder',
  )
}

export function getSpokenLanguageOptions(intl) {
  return mapOptions(
    intl,
    LANGUAGE_VALUES,
    'lms_options.language',
    'profile_card.language_placeholder',
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

export function getLmsProfileOptions(intl) {
  return {
    educationLevelOptions: getEducationLevelOptions(intl),
    genderOptions: getGenderOptions(intl),
    countryOptions: getCountryOptions(intl),
    spokenLanguageOptions: getSpokenLanguageOptions(intl),
    yearOfBirthOptions: getYearOfBirthOptions(intl),
  }
}
