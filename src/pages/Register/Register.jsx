import React, { useEffect } from 'react'
import { Layout, Form, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useActions } from '@/helpers'
import { signUpRequest } from '@/actions'
import {
  HOME_PAGE_ROUTE,
  LANDING_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  STUDENT,
} from '@/constants'
import theme from '@/theme'

const { Content } = Layout

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
    <Layout
      style={{
        background: `linear-gradient(to bottom, ${theme.colors.accentGreen}, #f0fff0)`,
      }}
    >
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: 'white',
          padding: '4rem 2rem',
          margin: '5rem auto',
          width: 'min(720px, 100%)',
          borderRadius: 16,
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 28 }}>Регистрация</h1>
            <div>
              <Button type='link' onClick={() => navigate(LANDING_PAGE_ROUTE)}>Назад на лэндинг</Button>
              <Button type='link' onClick={() => navigate(LOGIN_PAGE_ROUTE)}>Уже есть аккаунт? Войти</Button>
            </div>
          </div>

          <Form
            layout='vertical'
            onFinish={({ email, password, nickname, lastname, firstname }) => {
              actions.signUpRequest({
                user: {
                  email,
                  password,
                  nickname,
                  lastname,
                  firstname,
                  middlename: '',
                  role: STUDENT,
                },
                role: STUDENT,
              })
            }}
          >
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Введите email' }]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Пароль'
              name='password'
              rules={[{ required: true, message: 'Введите пароль' }]}
            >
              <Input.Password size='large' />
            </Form.Item>

            <Form.Item
              label='Никнейм'
              name='nickname'
              rules={[{ required: true, message: 'Введите никнейм' }]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Имя'
              name='firstname'
              rules={[{ required: true, message: 'Введите имя' }]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Фамилия'
              name='lastname'
              rules={[{ required: true, message: 'Введите фамилию' }]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                block
              >
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  )
}

export default Register
