import React from "react"
import { compose } from 'redux'
import { Button, Form, Input, notification, Spin } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { FormattedMessage, useIntl } from 'react-intl'

import { robboUnitMutationsGQL, robboUnitQuerysGQL } from "@/graphQL"

const RobboUnitCard = ({
    disableСhanges,
    data: {
        GetRobboUnitById,
        loading,
    },
    UpdateRobboUnit,
}) => {
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    }
    const [form] = Form.useForm()

    return (
        loading ? <Spin />
            : (
                <Form
                    name='normal_robbo_unit_card'
                    className='robbo-unit-form'
                    {...layout}
                    form={form}
                    initialValues={{
                        name: GetRobboUnitById?.name,
                        city: GetRobboUnitById?.city,
                    }}
                    onFinish={({ name, city }) => {
                        UpdateRobboUnit({
                            variables: {
                                input: {
                                    id: GetRobboUnitById?.id,
                                    name,
                                    city,
                                },
                            },
                        })
                    }}
                >
                    <Form.Item
                        name='name' label={<FormattedMessage id='robbo_unit_card.name' />}
                    >
                        <Input placeholder={GetRobboUnitById?.name} size='large' />
                    </Form.Item>
                    <Form.Item
                        name='city' label={<FormattedMessage id='robbo_unit_card.city' />}
                    >
                        <Input placeholder={GetRobboUnitById?.city} size='large' />
                    </Form.Item>
                    <Form.Item >
                        <Button
                            type='primary' htmlType='submit'
                            className='login-form-button'
                        >
                            <FormattedMessage id='robbo_unit_card.save' />
                        </Button>
                    </Form.Item>
                </Form>
            )
    )
}

const RobboUnitCardContainer = ({
    robboUnitId,
    disableСhanges,

}) => {
    const intl = useIntl()
    const WithGraphQLComponent = compose(
        graphql(
            robboUnitQuerysGQL.GET_ROBBO_UNIT_BY_ID,
            {
                options: props => {
                    return {
                        variables: {
                            id: robboUnitId,
                        },
                    }
                },
            }),
        graphql(
            robboUnitMutationsGQL.UPDATE_ROBBO_UNIT,
            {
                name: 'UpdateRobboUnit',
                options: {
                    onCompleted: () => {
                        notification.success({ description: intl.formatMessage({ id: 'notification.update_profile_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                },
            },
        ))
        (RobboUnitCard)
    return (
        <WithGraphQLComponent
            robboUnitId={robboUnitId}
            disableСhanges={disableСhanges}
        />
    )
}

export default RobboUnitCardContainer