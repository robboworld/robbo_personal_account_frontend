import React, { memo, useState, useEffect } from 'react'
import { Button, Select, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

import {
    FREE_LISTENER, PARENT,
    STUDENT, TEACHER,
    userRole,
} from '@/constants'

const SignUpForm = memo(({
    handleSubmit,
    needSelectRole,
}) => {
    const roles = [
        { value: STUDENT, label: userRole[STUDENT] },
        { value: TEACHER, label: userRole[TEACHER] },
        { value: PARENT, label: userRole[PARENT] },
        { value: FREE_LISTENER, label: userRole[FREE_LISTENER] },
    ]

    const [form] = Form.useForm()
    const [, forceUpdate] = useState({})
    useEffect(() => {
        forceUpdate({})
    }, [])

    return (
        <Form
            name='normal_login'
            className='signup-form'
            onFinish={(
                {
                    email,
                    password,
                    role,
                    nickname,
                    lastname,
                    firstname,
                    middlename,
                }) => {
                return handleSubmit({
                    email, password, role, nickname, lastname, firstname, middlename,
                })
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
                    placeholder='Email'
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
                    type='password'
                    placeholder='Пароль'
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='nickname'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите ваш Nickname!',
                    },
                ]}
            >
                <Input
                    placeholder='Nickname'
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='firstname'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите ваше Имя!',
                    },
                ]}
            >
                <Input
                    placeholder='Имя'
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='lastname'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите вашу Фамилию!',
                    },
                ]}
            >
                <Input
                    placeholder='Фамилия'
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='middlename'
                rules={[
                    {
                        required: true,
                        message: 'Пожалуйста, введите ваше Отчество!',
                    },
                ]}
            >
                <Input
                    placeholder='Отчество'
                    size='large'
                />
            </Form.Item>
            {
                needSelectRole &&
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
            }

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
                            Зарегистрироваться
                        </Button>
                    )
                }

            </Form.Item>
        </Form >
    )
})


SignUpForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    needSelectRole: PropTypes.bool,
}

export default SignUpForm