import React, { memo } from 'react'
import { Button, Select, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

import { LockOutlined, MailOutlined } from '@ant-design/icons'

import {
    FREE_LISTENER,
    PARENT,
    STUDENT,
    TEACHER,
    UNIT_ADMIN,
    SUPER_ADMIN,
    userRole,
} from '@/constants'

const SignInForm = memo(({
    handleSubmit,
    needSelectRole,
}) => {

    const roles = [
        { value: STUDENT, label: userRole[STUDENT] },
        { value: TEACHER, label: userRole[TEACHER] },
        { value: PARENT, label: userRole[PARENT] },
        { value: FREE_LISTENER, label: userRole[FREE_LISTENER] },
        { value: UNIT_ADMIN, label: userRole[UNIT_ADMIN] },
        { value: SUPER_ADMIN, label: userRole[SUPER_ADMIN] },
    ]

    const [form] = Form.useForm()

    return (
        <Form
            name='normal_login'
            className='login-form'
            onFinish={({ email, password, role }) => {
                return handleSubmit({ email, password, role })
            }}
            form={form}
        >
            <Form.Item
                name='email'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите ваш Email!',
                    },
                ]}
            >
                <Input
                    prefix={<MailOutlined className='site-form-item-icon' />} placeholder='Email'
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='password'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите ваш Пароль!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder='Пароль'
                    size='large'
                />
            </Form.Item>

            <Form.Item
                label='Выберите роль' name='role'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите вашу роль!',
                    },
                ]}
            >
                <Select
                    options={roles}
                    size='large'
                />
            </Form.Item>

            <Form.Item shouldUpdate>
                {
                    () => (
                        <Button
                            type='primary' htmlType='submit'
                            className='login-form-button'
                            disabled={
                                !form.isFieldsTouched(true) ||
                                !!form.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            Войти
                        </Button>
                    )
                }
            </Form.Item>
        </Form >
    )
})

SignInForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    needSelectRole: PropTypes.bool,
}

export default SignInForm