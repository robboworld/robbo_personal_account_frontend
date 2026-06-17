import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import AuthLayout, { AuthFormStyles } from '@/components/AuthLayout'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers'
import { shouldRedirectAuthenticatedUserToHome } from '@/helpers/publicAuthGate'
import { signUpRequest } from '@/actions'
import {
  HOME_PAGE_ROUTE,
  STUDENT,
} from '@/constants'

const Register = () => {
  const intl = useIntl()
  const isAuth = useSelector(({ login }) => login.isAuth)
  const [redirectHome, setRedirectHome] = useState(null)

  const actions = useActions({ signUpRequest }, [])

  useEffect(() => {
    if (isAuth) {
      setRedirectHome(true)
      return undefined
    }

    let cancelled = false

    shouldRedirectAuthenticatedUserToHome().then(shouldRedirect => {
      if (!cancelled) {
        setRedirectHome(shouldRedirect)
      }
    })

    return () => {
      cancelled = true
    }
  }, [isAuth])

  if (redirectHome === null) {
    return <Loader />
  }

  if (redirectHome) {
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  return (
    <AuthLayout activeTab='register'>
      <AuthFormStyles className='mw-xs mt-3'>
        <Form
          layout='vertical'
          requiredMark={false}
          onFinish={({ email, password, nickname, fullName, company }) => {
            actions.signUpRequest({
              user: {
                email,
                password,
                nickname,
                fullName,
                company,
                firstname: '',
                lastname: '',
                middlename: '',
                role: STUDENT,
              },
              role: STUDENT,
            })
          }}
        >
          <Form.Item
            label={intl.formatMessage({ id: 'register_page.full_name' })}
            name='fullName'
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'register_page.full_name_rule' }),
            }]}
          >
            <Input size='large' autoComplete='name' />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({ id: 'register_page.company' })}
            name='company'
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'register_page.company_rule' }),
            }]}
          >
            <Input size='large' autoComplete='organization' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'register_page.email_rule' }),
              },
              {
                type: 'email',
                message: intl.formatMessage({ id: 'register_page.email_invalid' }),
              },
            ]}
          >
            <Input size='large' autoComplete='email' />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({ id: 'sign_up_form.nickname_placeholder' })}
            name='nickname'
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'register_page.nickname_rule' }),
            }]}
          >
            <Input size='large' autoComplete='username' />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({ id: 'sign_up_form.password_placeholder' })}
            name='password'
            rules={[{
              required: true,
              message: intl.formatMessage({ id: 'register_page.password_rule' }),
            }]}
          >
            <Input.Password size='large' autoComplete='new-password' />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              className='register-button'
            >
              <FormattedMessage id='register_page.submit' />
            </Button>
          </Form.Item>
        </Form>
      </AuthFormStyles>
    </AuthLayout>
  )
}

export default Register
