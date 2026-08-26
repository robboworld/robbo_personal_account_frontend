import React, { useState } from 'react'
import { Alert, Button, Input } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import SignInForm from '@/components/SignInForm'
import { AuthFormStyles } from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import {
  passwordLoginOidc,
  resolveLoginReturnTo,
} from '@/helpers/oidcSession'
import { LMS_URL } from '@/constants'
import '@/styles/registration.css'

const LMS_RESET_PASSWORD_URL = `${LMS_URL}/authn/reset`

const LoginTextField = ({
  name,
  label,
  value,
  errorMessage,
  onChange,
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
        autoComplete={autoComplete}
        aria-invalid={Boolean(errorMessage)}
      />
    )}
    {errorMessage && (
      <div className='registration-field__error' id={`${name}-error`}>{errorMessage}</div>
    )}
  </div>
)

LoginTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
}

/**
 * LK login: identity + password (registration-like UI).
 * Issues BFF session via API — no IdP/mock page flash before /home.
 */
const MockOidcSignInForm = ({ initialError = null }) => {
  const intl = useIntl()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(initialError)
  const [formFields, setFormFields] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  React.useEffect(() => {
    setFormError(initialError)
  }, [initialError])

  const handleFieldChange = (name, value) => {
    setFormFields(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (formError) {
      setFormError(null)
    }
  }

  const validate = () => {
    const next = {}
    if (!formFields.emailOrUsername.trim()) {
      next.emailOrUsername = intl.formatMessage({ id: 'login.email.validation.message' })
    } else if (formFields.emailOrUsername.trim().length < 2) {
      next.emailOrUsername = intl.formatMessage({
        id: 'login.username.or.email.format.validation.less.chars.message',
      })
    }
    if (!formFields.password) {
      next.password = intl.formatMessage({ id: 'login.password.validation.message' })
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validate() || submitting) {
      return
    }

    const trimmed = formFields.emailOrUsername.trim()
    setFormError(null)
    setSubmitting(true)
    try {
      const returnTo = resolveLoginReturnTo(location.search)
      const result = await passwordLoginOidc(trimmed, formFields.password, returnTo)
      if (!result.ok) {
        const errorKey = {
          user_not_found: 'login.error.user_not_found',
          invalid_credentials: 'login.error.invalid_credentials',
          user_inactive: 'login.error.user_inactive',
          lms_unavailable: 'login.error.lms_unavailable',
          session_limit_reached: 'sessions.limit_reached',
        }[result.error] || 'login.error.generic'
        setFormError(intl.formatMessage({ id: errorKey }))
        setSubmitting(false)
        return
      }

      // Same-origin navigate — keep AuthLayout until /home mounts (no mock IdP flash).
      const target = result.return_to || returnTo || '/home'
      if (target.startsWith('http://') || target.startsWith('https://')) {
        window.location.assign(target)
      } else {
        window.location.assign(target.startsWith('/') ? target : `/${target}`)
      }
    } catch {
      setFormError(intl.formatMessage({ id: 'login.error.generic' }))
      setSubmitting(false)
    }
  }

  return (
    <AuthFormStyles className='mw-xs'>
      {formError ? (
        <Alert
          type='error'
          showIcon
          style={{ marginBottom: 16 }}
          message={formError}
        />
      ) : null}
      <form id='login-form' name='login-form'
onSubmit={handleSubmit} noValidate>
        <LoginTextField
          name='emailOrUsername'
          label={intl.formatMessage({ id: 'login.user.identity.label' })}
          value={formFields.emailOrUsername}
          errorMessage={fieldErrors.emailOrUsername}
          onChange={handleFieldChange}
          autoComplete='username'
        />

        <LoginTextField
          name='password'
          label={intl.formatMessage({ id: 'login.password.label' })}
          value={formFields.password}
          errorMessage={fieldErrors.password}
          onChange={handleFieldChange}
          type='password'
          autoComplete='current-password'
        />

        <Button
          type='primary'
          htmlType='submit'
          size='large'
          block
          className='register-button'
          loading={submitting}
        >
          <FormattedMessage id='sign_in_form.sign_in' />
        </Button>

        <div className='authn-sign-in-actions' style={{ marginTop: 12 }}>
          <a
            id='forgot-password'
            className='authn-forgot-password-link inline-link'
            href={LMS_RESET_PASSWORD_URL}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FormattedMessage id='forgot.password' />
          </a>
        </div>
      </form>
    </AuthFormStyles>
  )
}

MockOidcSignInForm.propTypes = {
  initialError: PropTypes.string,
}

const LoginContent = ({
  showOidcLogin = false,
  initialLoginError = null,
  children,
}) => {
  const actions = useActions({ signInRequest, signUpRequest }, [])

  if (children) {
    return <React.Fragment>{children}</React.Fragment>
  }

  if (showOidcLogin) {
    return <MockOidcSignInForm initialError={initialLoginError} />
  }

  return (
    <AuthFormStyles className='mw-xs mb-2'>
      <SignInForm handleSubmit={user => actions.signInRequest(user)} />
    </AuthFormStyles>
  )
}

LoginContent.propTypes = {
  showOidcLogin: PropTypes.bool,
  initialLoginError: PropTypes.string,
  children: PropTypes.node,
}

export default LoginContent
