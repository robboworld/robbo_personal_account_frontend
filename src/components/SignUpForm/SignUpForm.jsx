import React, { memo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

const SignUpForm = memo(({
    handleSubmit,
    robboGroupId,
    robboUnitId,
}) => {
    const [form] = Form.useForm()

    return (
        <Form
            className='signup-form'
            onFinish={(
                {
                    email,
                    password,
                    nickname,
                    lastname,
                    firstname,
                    middlename,
                }) => {
                handleSubmit({
                    variables: {
                        input: {
                            email,
                            password,
                            nickname,
                            lastname,
                            firstname,
                            middlename,
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
                    placeholder='Email'
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
                        message: <FormattedMessage id='sign_up_form.nickname_rule' />,
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
                        message: <FormattedMessage id='sign_up_form.firstname_rule' />,
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
                        message: <FormattedMessage id='sign_up_form.lastname_rule' />,
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
                        message: <FormattedMessage id='sign_up_form.middlename_rule' />,
                    },
                ]}
            >
                <Input
                    placeholder='Отчество'
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
                            <FormattedMessage id='sign_up_form.add' />
                        </Button>
                    )
                }

            </Form.Item>
        </Form >
    )
})


SignUpForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    robboGroupId: PropTypes.string,
    robboUnitId: PropTypes.string,
}

export default SignUpForm