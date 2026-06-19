import { createAction } from 'redux-actions'

export const BACKUP_LOGIN_FORM = 'BACKUP_LOGIN_FORM'
export const BACKUP_LOGIN_FORM_BEGIN = 'BACKUP_LOGIN_FORM_BEGIN'
export const BACKUP_REGISTRATION_FORM = 'BACKUP_REGISTRATION_FORM'
export const BACKUP_REGISTRATION_FORM_BEGIN = 'BACKUP_REGISTRATION_FORM_BEGIN'

export const backupLoginForm = createAction(BACKUP_LOGIN_FORM)
export const backupLoginFormBegin = createAction(BACKUP_LOGIN_FORM_BEGIN, data => data)
export const backupRegistrationForm = createAction(BACKUP_REGISTRATION_FORM)
export const backupRegistrationFormBegin = createAction(
  BACKUP_REGISTRATION_FORM_BEGIN,
  data => data,
)
