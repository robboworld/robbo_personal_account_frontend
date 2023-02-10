import React from 'react'
import { compose } from 'redux'
import { PropTypes } from 'prop-types'
import { graphql } from '@apollo/client/react/hoc'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Form, Input, notification, Spin } from 'antd'

import { robboGroupQuerysGQL, robboGroupMutationsGQL } from "@/graphQL"

const RobboGroupCard = ({
    robboGroupId,
    disableСhanges,
    data: {
        GetRobboGroupById,
        loading,
    },
    UpdateRobboGroup,
}) => {
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }
    const [form] = Form.useForm()

    return (
        loading ? <Spin />
            : (
                <Form
                    name='normal_robbo_group_card'
                    className='robbo-group-form'
                    labelWrap
                    disabled={disableСhanges}
                    {...layout}
                    form={form}
                    initialValues={{
                        name: GetRobboGroupById?.name,
                    }}
                    onFinish={({ name }) => {
                        UpdateRobboGroup({
                            variables: {
                                input: {
                                    id: GetRobboGroupById?.id,
                                    robboUnitId: GetRobboGroupById?.robboUnitId,
                                    name: name,
                                },
                            },
                        })
                    }}
                >
                    <Form.Item
                        name='name' label={<FormattedMessage id='robbo_group_card.name' />}
                    >
                        <Input placeholder={GetRobboGroupById?.name} size='large' />
                    </Form.Item>
                    <Form.Item label={<FormattedMessage id='robbo_group_card.last_change' />}>
                        {
                            GetRobboGroupById?.lastModified
                        }
                    </Form.Item>
                    <Form.Item >
                        <Button
                            type='primary' htmlType='submit'
                            className='login-form-button'
                        >
                            <FormattedMessage id='robbo_group_card.save' />
                        </Button>
                    </Form.Item>
                </Form>
            )
    )
}

const RobboGroupCardContainer = ({
    robboGroupId,
    disableСhanges,

}) => {
    const intl = useIntl()
    const WithGraphQLComponent = compose(
        graphql(
            robboGroupQuerysGQL.GET_ROBBO_GROUP_BY_ID,
            {
                options: props => {
                    return {
                        variables: {
                            id: robboGroupId,
                        },
                    }
                },
            }),
        graphql(
            robboGroupMutationsGQL.UPDATE_ROBBO_GROUP,
            {
                name: 'UpdateRobboGroup',
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
        (RobboGroupCard)
    return (
        <WithGraphQLComponent
            robboGroupId={robboGroupId}
            disableСhanges={disableСhanges}
        />
    )
}

RobboGroupCard.propTypes = {
    robboGroupId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboGroupCardContainer