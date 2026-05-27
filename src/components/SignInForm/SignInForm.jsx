import React, { memo } from 'react'
import { Button, Form, Input, notification } from 'antd'
import { PropTypes } from 'prop-types'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useIntl, FormattedMessage } from 'react-intl'

import { LockOutlined, MailOutlined } from '@ant-design/icons'

import { HOME_PAGE_ROUTE } from '@/constants'
import { authMutationsGQL } from '@/graphQL'


const SignInForm = memo(({ handleSubmit }) => {
    const intl = useIntl()

    const [form] = Form.useForm()
    const navigate = useNavigate()

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


    return (
        <Form
            name='normal_login'
            className='login-form'
            onFinish={({ email, password }) => {
                login({
                    variables: {
                        input: {
                            email,
                            password,
                            userRole: 0,
                        },
                    },
                })
            }}
            form={form}
        >
            <Form.Item
                name='email'
                rules={[
                    {
                        required: true,
                        message: <FormattedMessage id='sign_up_form.email_rule' />,
                    },
                ]}
            >
                <Input
                    prefix={<MailOutlined className='site-form-item-icon' />}
                    placeholder={intl.formatMessage({ id: 'sign_up_form.email_placeholder' })}
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='password'
                rules={[
                    {
                        required: true,
                        message: <FormattedMessage id='sign_up_form.password_rule' />,
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    type='password'
                    placeholder={intl.formatMessage({ id: 'sign_up_form.password_placeholder' })}
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
                            <FormattedMessage id='sign_in_form.sign_in' />
                        </Button>
                    )
                }
            </Form.Item>
        </Form >
    )
})

SignInForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
}

export default SignInForm