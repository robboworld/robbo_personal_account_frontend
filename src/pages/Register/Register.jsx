import React, { useEffect } from 'react'
import { Layout, Form, Input, Select, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { useActions } from '@/helpers'
import { signUpRequest } from '@/actions'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, userRole, STUDENT, TEACHER, PARENT, FREE_LISTENER, UNIT_ADMIN, SUPER_ADMIN } from '@/constants'

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

  const roleOptions = [
    { value: STUDENT, label: userRole[STUDENT] },
    { value: TEACHER, label: userRole[TEACHER] },
    { value: PARENT, label: userRole[PARENT] },
    { value: FREE_LISTENER, label: userRole[FREE_LISTENER] },
    { value: UNIT_ADMIN, label: userRole[UNIT_ADMIN] },
    { value: SUPER_ADMIN, label: userRole[SUPER_ADMIN] },
  ]

  return (
    <Layout style={{ background: 'linear-gradient(to bottom, #008000, #f0fff0)' }}>
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
            <Button type='link' onClick={() => navigate(LOGIN_PAGE_ROUTE)}>Уже есть аккаунт? Войти</Button>
          </div>

          <Form
            layout='vertical'
            onFinish={({ email, password, nickname, lastname, firstname, middlename, role }) => {
              actions.signUpRequest({
                user: {
                  email,
                  password,
                  nickname,
                  lastname,
                  firstname,
                  middlename,
                  role,
                },
                role,
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

            <Form.Item
              label='Отчество'
              name='middlename'
              rules={[{ required: true, message: 'Введите отчество' }]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item
              label='Роль'
              name='role'
              rules={[{ required: true, message: 'Выберите роль' }]}
            >
              <Select options={roleOptions} size='large' />
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

