import { handleActions } from 'redux-actions'

import {
  BACKUP_LOGIN_FORM,
  BACKUP_LOGIN_FORM_BEGIN,
  BACKUP_REGISTRATION_FORM,
  BACKUP_REGISTRATION_FORM_BEGIN,
} from '@/actions/authForms'

const defaultLoginFormData = {
  formFields: {
    emailOrUsername: '',
    password: '',
  },
  errors: {},
}

const defaultRegistrationFormData = {
  formFields: {
    name: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
    honor_code: false,
    marketing_emails_opt_in: false,
  },
  errors: {},
}

const INITIAL_STATE = {
  loginFormData: defaultLoginFormData,
  registrationFormData: defaultRegistrationFormData,
  shouldBackupLogin: false,
  shouldBackupRegister: false,
}

export default handleActions({
  [BACKUP_LOGIN_FORM](state) {
    return { ...state, shouldBackupLogin: true }
  },
  [BACKUP_LOGIN_FORM_BEGIN](state, action) {
    return {
      ...state,
      loginFormData: { ...action.payload },
      shouldBackupLogin: false,
    }
  },
  [BACKUP_REGISTRATION_FORM](state) {
    return { ...state, shouldBackupRegister: true }
  },
  [BACKUP_REGISTRATION_FORM_BEGIN](state, action) {
    return {
      ...state,
      registrationFormData: { ...action.payload },
      shouldBackupRegister: false,
    }
  },
}, INITIAL_STATE)
