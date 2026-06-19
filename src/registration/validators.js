import {
  HTML_REGEX,
  INVALID_NAME_REGEX,
  LETTER_REGEX,
  NUMBER_REGEX,
  URL_REGEX,
  VALID_EMAIL_REGEX,
  VALID_USERNAME_REGEX,
} from './constants'
import { validatePhoneField } from './phoneValidation'

export function nameHasThreeWords(value) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) {
    return false
  }
  return trimmed.split(/\s+/).length === 3
}

export function validateName(value, intl) {
  if (!String(value ?? '').trim()) {
    return intl.formatMessage({ id: 'registration.empty.name.field.error' })
  }
  if (!nameHasThreeWords(value)) {
    return intl.formatMessage({ id: 'registration.robbo.name.three_words_error' })
  }
  if (URL_REGEX.test(value) || HTML_REGEX.test(value) || INVALID_NAME_REGEX.test(value)) {
    return intl.formatMessage({ id: 'registration.name.validation.message' })
  }
  return ''
}

export function validateEmail(value, intl) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) {
    return intl.formatMessage({ id: 'registration.empty.email.field.error' })
  }
  if (!VALID_EMAIL_REGEX.test(trimmed)) {
    return intl.formatMessage({ id: 'registration.email.invalid.format.error' })
  }
  return ''
}

export function validateUsername(value, intl) {
  if (!value || value.length <= 1 || value.length > 30) {
    return intl.formatMessage({ id: 'registration.username.validation.message' })
  }
  if (!VALID_USERNAME_REGEX.test(value)) {
    return intl.formatMessage({ id: 'registration.username.format.validation.message' })
  }
  return ''
}

export function validatePassword(value, intl) {
  if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
    return intl.formatMessage({ id: 'registration.password.validation.message' })
  }
  return ''
}

export function validateHonorCode(checked, intl) {
  if (!checked) {
    return intl.formatMessage({ id: 'registration.robbo.honor.required_error' })
  }
  return ''
}

export function validateMarketingOptIn(checked, intl) {
  if (!checked) {
    return intl.formatMessage({ id: 'registration.robbo.marketing.required_error' })
  }
  return ''
}

export function validateRegistrationForm(fields, intl) {
  const errors = {
    name: validateName(fields.name, intl),
    email: validateEmail(fields.email, intl),
    phone_number: validatePhoneField(
      fields.phone_number,
      intl.formatMessage({ id: 'registration.robbo.phone.invalid_error' }),
    ),
    username: validateUsername(fields.username, intl),
    password: validatePassword(fields.password, intl),
    honor_code: validateHonorCode(fields.honor_code, intl),
    marketing_emails_opt_in: validateMarketingOptIn(fields.marketing_emails_opt_in, intl),
  }

  const isValid = Object.values(errors).every(error => !error)
  return { errors, isValid }
}
