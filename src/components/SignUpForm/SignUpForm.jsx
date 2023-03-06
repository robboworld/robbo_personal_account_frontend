import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Form, Input } from 'antd'
import { PropTypes } from 'prop-types'

const SignUpForm = memo(({
    handleSubmit,
    parentId,
    robboGroupId,
    robboUnitId,
}) => {
    const [form] = Form.useForm()
    const intl = useIntl()
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
                            robboUnitId,
                            robboGroupId,
                            parentId,
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
                    type='password'
                    placeholder={intl.formatMessage({ id: 'sign_up_form.password_placeholder' })}
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
                    placeholder={intl.formatMessage({ id: 'sign_up_form.nickname_placeholder' })}
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
                    placeholder={intl.formatMessage({ id: 'sign_up_form.firstname_placeholder' })}
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
                    placeholder={intl.formatMessage({ id: 'sign_up_form.lastname_placeholder' })}
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
                    placeholder={intl.formatMessage({ id: 'sign_up_form.middlename_placeholder' })}
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
    parentId: PropTypes.string,
    robboGroupId: PropTypes.string,
    robboUnitId: PropTypes.string,
}

export default SignUpForm