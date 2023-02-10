import React, { memo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Form, Input } from 'antd'

export default memo(({
    robboUnitId,
    handleSubmit,
}) => {
    const intl = useIntl()
    const [form] = Form.useForm()
    return (
        <Form
            className='robbo-group-form'
            onFinish={(
                {
                    name,
                }) => {
                handleSubmit({
                    variables: {
                        input: {
                            name,
                            robboUnitId: String(robboUnitId),
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
                        message: <FormattedMessage id='robbo_group_form.name_rule' />,
                    },
                ]}
            >
                <Input
                    placeholder={intl.formatMessage({ id: 'robbo_group_card.name' })}
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
                    <FormattedMessage id='robbo_group_form.add' />
                </Button>
            </Form.Item>
        </Form>
    )
})