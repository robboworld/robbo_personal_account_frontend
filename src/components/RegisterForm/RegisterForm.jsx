import React, { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import { AuthFormStyles } from '@/components/AuthLayout'
import PhoneField from '@/components/RegistrationFields/PhoneField'
import HonorConsent from '@/components/RegistrationFields/HonorConsent'
import MarketingOptIn from '@/components/RegistrationFields/MarketingOptIn'
import { backupRegistrationFormBegin } from '@/actions/authForms'
import { signUpRequest } from '@/actions'
import { STUDENT } from '@/constants'
import { useActions } from '@/helpers'
import { normalizeRobboPhoneNumber } from '@/registration/phoneValidation'
import { validateRegistrationForm } from '@/registration/validators'
import '@/styles/registration.css'

const EMPTY_FIELDS = {
  name: '',
  email: '',
  phone_number: '',
  username: '',
  password: '',
  honor_code: false,
  marketing_emails_opt_in: false,
}

const RegistrationTextField = ({
  name,
  label,
  value,
  errorMessage,
  onChange,
  onBlur,
  type = 'text',
  autoComplete,
}) => (
  <div className={`registration-field${errorMessage ? ' registration-field--invalid' : ''}`}>
    <label className='registration-field__label' htmlFor={name}>{label}</label>
    {type === 'password' ? (
      <Input.Password
        id={name}
        name={name}
        size='large'
        className='registration-field__input'
        value={value}
        onChange={event => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        autoComplete={autoComplete}
        status={errorMessage ? 'error' : undefined}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        className='registration-field__input'
        value={value}
        onChange={event => onChange(name, event.target.value)}
        onBlur={() => onBlur(name)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errorMessage)}
      />
    )}
    {errorMessage && (
      <div className='registration-field__error' id={`${name}-error`}>{errorMessage}</div>
    )}
  </div>
)

const RegisterForm = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const actions = useActions({ signUpRequest }, [])
  const restoredRef = useRef(false)

  const backedUpFormData = useSelector(state => state.authForms.registrationFormData)
  const shouldBackupRegister = useSelector(state => state.authForms.shouldBackupRegister)
  const signUpLoading = useSelector(state => state.login.signUpLoading)

  const [formFields, setFormFields] = useState(() => ({
    ...EMPTY_FIELDS,
    ...(backedUpFormData?.formFields || {}),
  }))
  const [errors, setErrors] = useState(() => ({
    ...(backedUpFormData?.errors || {}),
  }))

  useEffect(() => {
    if (restoredRef.current) {
      return
    }
    restoredRef.current = true
    if (backedUpFormData?.formFields) {
      setFormFields(prev => ({ ...prev, ...backedUpFormData.formFields }))
    }
    if (backedUpFormData?.errors) {
      setErrors(backedUpFormData.errors)
    }
  }, [backedUpFormData])

  useEffect(() => {
    if (shouldBackupRegister) {
      dispatch(backupRegistrationFormBegin({
        formFields: { ...formFields },
        errors: { ...errors },
      }))
    }
  }, [shouldBackupRegister, formFields, errors, dispatch])

  const handleFieldChange = (name, value) => {
    setFormFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFieldBlur = name => {
    if (name === 'phone_number') {
      const normalized = normalizeRobboPhoneNumber(formFields.phone_number)
      if (normalized !== formFields.phone_number) {
        setFormFields(prev => ({ ...prev, phone_number: normalized }))
      }
    }
    const { errors: nextErrors } = validateRegistrationForm(formFields, intl)
    setErrors(prev => ({ ...prev, [name]: nextErrors[name] || '' }))
  }

  const handlePhoneBlur = (name, value) => {
    const normalized = normalizeRobboPhoneNumber(value)
    setFormFields(prev => ({ ...prev, [name]: normalized }))
    const nextFields = { ...formFields, [name]: normalized }
    const { errors: nextErrors } = validateRegistrationForm(nextFields, intl)
    setErrors(prev => ({ ...prev, [name]: nextErrors[name] || '' }))
  }

  const handleSubmit = event => {
    event.preventDefault()
    const { errors: nextErrors, isValid } = validateRegistrationForm(formFields, intl)
    setErrors(nextErrors)
    if (!isValid || signUpLoading) {
      return
    }

    actions.signUpRequest({
      user: {
        email: formFields.email.trim(),
        password: formFields.password,
        nickname: formFields.username.trim(),
        fullName: formFields.name.trim(),
        phone_number: normalizeRobboPhoneNumber(formFields.phone_number),
        honor_code: formFields.honor_code,
        marketing_emails_opt_in: formFields.marketing_emails_opt_in,
        firstname: '',
        lastname: '',
        middlename: '',
        role: STUDENT,
      },
      role: STUDENT,
    })
  }

  return (
    <AuthFormStyles className='mw-xs'>
      <form id='registration-form' name='registration-form'
onSubmit={handleSubmit} noValidate>
        <RegistrationTextField
          name='name'
          label={intl.formatMessage({ id: 'registration.fullname.label' })}
          value={formFields.name}
          errorMessage={errors.name}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          autoComplete='name'
        />

        <RegistrationTextField
          name='email'
          label={intl.formatMessage({ id: 'registration.email.label' })}
          value={formFields.email}
          errorMessage={errors.email}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          type='email'
          autoComplete='email'
        />

        <PhoneField
          name='phone_number'
          label={intl.formatMessage({ id: 'registration.robbo.phone.label' })}
          helpText={intl.formatMessage({ id: 'registration.robbo.phone.help' })}
          value={formFields.phone_number}
          errorMessage={errors.phone_number}
          onChange={handleFieldChange}
          onBlur={handlePhoneBlur}
        />

        <RegistrationTextField
          name='username'
          label={intl.formatMessage({ id: 'registration.username.label' })}
          value={formFields.username}
          errorMessage={errors.username}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          autoComplete='username'
        />

        <RegistrationTextField
          name='password'
          label={intl.formatMessage({ id: 'registration.password.label' })}
          value={formFields.password}
          errorMessage={errors.password}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          type='password'
          autoComplete='new-password'
        />

        <MarketingOptIn
          checked={formFields.marketing_emails_opt_in}
          errorMessage={errors.marketing_emails_opt_in}
          onChange={value => handleFieldChange('marketing_emails_opt_in', value)}
          onBlur={() => handleFieldBlur('marketing_emails_opt_in')}
        />

        <HonorConsent
          checked={formFields.honor_code}
          errorMessage={errors.honor_code}
          onChange={value => handleFieldChange('honor_code', value)}
          onBlur={() => handleFieldBlur('honor_code')}
        />

        <Button
          type='primary'
          htmlType='submit'
          size='large'
          block
          className='register-button'
          loading={signUpLoading}
        >
          <FormattedMessage id='registration.create.account.for.free.button' />
        </Button>
      </form>
    </AuthFormStyles>
  )
}

export default RegisterForm
