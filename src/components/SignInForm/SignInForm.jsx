import React, { memo, useEffect, useRef } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { PropTypes } from 'prop-types'
import { useMutation } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useIntl, FormattedMessage } from 'react-intl'

import { backupLoginFormBegin } from '@/actions/authForms'
import { HOME_PAGE_ROUTE, LMS_URL } from '@/constants'
import { authMutationsGQL } from '@/graphQL'

const LMS_RESET_PASSWORD_URL = `${LMS_URL}/authn/reset`

function collectFieldErrors(form) {
  return form.getFieldsError().reduce((acc, { name, errors }) => {
    if (errors.length && name?.[0]) {
      acc[name[0]] = errors
    }
    return acc
  }, {})
}

function normalizeBackedUpLoginFields(formFields) {
  if (!formFields) {
    return formFields
  }

  const fields = { ...formFields }
  if (fields.email !== undefined && fields.emailOrUsername === undefined) {
    fields.emailOrUsername = fields.email
    delete fields.email
  }
  return fields
}

const SignInForm = memo(({ handleSubmit }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const restoredRef = useRef(false)

  const backedUpFormData = useSelector(state => state.authForms.loginFormData)
  const shouldBackupLogin = useSelector(state => state.authForms.shouldBackupLogin)

  const [login] = useMutation(authMutationsGQL.SIGN_IN, {
    onCompleted: ({ SingIn }) => {
      localStorage.setItem('token', SingIn.accessToken)
      navigate(HOME_PAGE_ROUTE)
    },
    onError: error => {
      notification.error({
        message: intl.formatMessage({ id: 'notification.error_message' }),
        description: error?.message,
      })
    },
  })

  useEffect(() => {
    if (restoredRef.current) {
      return
    }
    restoredRef.current = true

    if (backedUpFormData?.formFields) {
      form.setFieldsValue(normalizeBackedUpLoginFields(backedUpFormData.formFields))
    }
    if (backedUpFormData?.errors && Object.keys(backedUpFormData.errors).length > 0) {
      const fields = Object.entries(backedUpFormData.errors).map(([name, errors]) => ({
        name: name === 'email' ? 'emailOrUsername' : name,
        errors: Array.isArray(errors) ? errors : [errors],
      }))
      form.setFields(fields)
    }
  }, [form, backedUpFormData])

  useEffect(() => {
    if (shouldBackupLogin) {
      dispatch(backupLoginFormBegin({
        formFields: form.getFieldsValue(),
        errors: collectFieldErrors(form),
      }))
    }
  }, [shouldBackupLogin, form, dispatch])

  return (
    <Form
      id='sign-in-form'
      name='sign-in-form'
      className='login-form'
      layout='vertical'
      requiredMark={false}
      onFinish={({ emailOrUsername, password }) => {
        login({
          variables: {
            input: {
              email: emailOrUsername,
              password,
              userRole: 0,
            },
          },
        })
      }}
      form={form}
    >
      <Form.Item
        name='emailOrUsername'
        label={intl.formatMessage({ id: 'login.user.identity.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'login.email.validation.message' }),
          },
          {
            min: 2,
            message: intl.formatMessage({ id: 'login.username.or.email.format.validation.less.chars.message' }),
          },
        ]}
      >
        <Input
          size='large'
          autoComplete='on'
        />
      </Form.Item>
      <Form.Item
        name='password'
        label={intl.formatMessage({ id: 'login.password.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'login.password.validation.message' }),
          },
        ]}
      >
        <Input.Password
          size='large'
          autoComplete='off'
        />
      </Form.Item>

      <div className='authn-sign-in-actions'>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          className='login-form-button'
        >
          <FormattedMessage id='sign_in_form.sign_in' />
        </Button>
        <a
          id='forgot-password'
          className='authn-forgot-password-link'
          href={LMS_RESET_PASSWORD_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          <FormattedMessage id='forgot.password' />
        </a>
      </div>
    </Form>
  )
})

SignInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default SignInForm
