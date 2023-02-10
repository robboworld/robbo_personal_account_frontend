import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Form, Input } from 'antd'

export default memo(({
    handleSubmit,
}) => {
    const intl = useIntl()
    const [form] = Form.useForm()

    return (
        <Form
            className='robbo-unit-form'
            onFinish={(
                {
                    name,
                    city,
                }) => {
                handleSubmit({
                    variables: {
                        input: {
                            name,
                            city,
                        },
                    },
                })
            }}
            form={form}
        >
            <Form.Item
                name='name'
                rules={[
                    {
                        required: true,
                        message: <FormattedMessage id='robbo_unit_form.name_rule' />,
                    },
                ]}
            >
                <Input
                    placeholder={intl.formatMessage({ id: 'robbo_unit_card.name' })}
                    size='large'
                />
            </Form.Item>
            <Form.Item
                name='city'
                rules={[
                    {
                        required: true,
                        message: <FormattedMessage id='robbo_unit_form.city_rule' />,
                    },
                ]}
            >
                <Input
                    placeholder={intl.formatMessage({ id: 'robbo_unit_card.city' })}
                    size='large'
                />
            </Form.Item>
            <Form.Item >

                <Button
                    type='primary' htmlType='submit'
                    className='login-form-button'
                    disabled={
                        !form.isFieldsTouched(true) ||
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                >
                    <FormattedMessage id='robbo_unit_form.add' />
                </Button>
            </Form.Item>
        </Form>
    )
})