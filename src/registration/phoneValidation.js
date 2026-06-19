import { isValidPhoneNumber as isValidLibPhoneNumber } from 'libphonenumber-js'

export const RU_PHONE_PATTERN = /^\+7\d{10}$/
export const INTL_PHONE_PATTERN = /^\+(?!7)[1-9]\d{7,14}$/

export function normalizeRobboPhoneNumber(value) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed.startsWith('+')) {
    return ''
  }
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) {
    return ''
  }
  return `+${digits}`
}

export function isValidRobboPhoneNumber(value) {
  const normalized = normalizeRobboPhoneNumber(value)
  if (!normalized) {
    return true
  }
  if (normalized.startsWith('+7') && normalized.length !== 12) {
    return false
  }
  if (RU_PHONE_PATTERN.test(normalized) || INTL_PHONE_PATTERN.test(normalized)) {
    return true
  }
  if (!normalized.startsWith('+7')) {
    try {
      if (isValidLibPhoneNumber(normalized)) {
        return true
      }
    } catch {
      // ignore parse errors
    }
  }
  return false
}

export function validatePhoneField(value, invalidErrorMessage) {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) {
    return ''
  }
  if (!isValidRobboPhoneNumber(trimmed)) {
    return invalidErrorMessage
  }
  return ''
}
