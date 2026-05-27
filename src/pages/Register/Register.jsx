import React, { useEffect } from 'react'
import { Form, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AuthLayout, { AuthFormStyles } from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signUpRequest } from '@/actions'
import {
  HOME_PAGE_ROUTE,
  STUDENT,
} from '@/constants'

const Register = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(({ login }) => login.isAuth)

  const actions = useActions({ signUpRequest }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate(HOME_PAGE_ROUTE, { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (isAuth) {
      navigate(HOME_PAGE_ROUTE, { replace: true })
    }
  }, [isAuth, navigate])

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
            label='Полное имя'
            name='fullName'
            rules={[{ required: true, message: 'Введите полное имя' }]}
          >
            <Input size='large' autoComplete='name' />
          </Form.Item>

          <Form.Item
            label='Название компании'
            name='company'
            rules={[{ required: true, message: 'Введите название компании' }]}
          >
            <Input size='large' autoComplete='organization' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input size='large' autoComplete='email' />
          </Form.Item>

          <Form.Item
            label='Никнейм'
            name='nickname'
            rules={[{ required: true, message: 'Введите никнейм' }]}
          >
            <Input size='large' autoComplete='username' />
          </Form.Item>

          <Form.Item
            label='Пароль'
            name='password'
            rules={[{ required: true, message: 'Введите пароль' }]}
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
              Создать аккаунт бесплатно
            </Button>
          </Form.Item>
        </Form>
      </AuthFormStyles>
    </AuthLayout>
  )
}

export default Register
