import React, { memo } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'

import SignUpForm from '@/components/SignUpForm'
import { parentMutationsGQL } from '@/graphQL'

const AddParent = memo(({
    CreateParent,
}) => {
    return (
        <Col span={24}>
            <SignUpForm handleSubmit={CreateParent} />
        </Col>
    )
})

const AddParentContainer = () => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        parentMutationsGQL.CREATE_PARENT,
        {
            name: 'CreateParent',
            options: {
                onCompleted: () => {
                    notification.success({ description: intl.formatMessage({ id: 'notification.client_create_success' }) })
                },
                onError: error => {
                    notification.error({
                        message: intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            },
        },
    )(AddParent)
    return <WithGraphQL />
}

export default AddParentContainer