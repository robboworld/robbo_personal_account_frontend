import React, { memo } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'

import SignUpForm from '@/components/SignUpForm'
import { unitAdminMutationsGQL } from '@/graphQL'



const AddUnitAdmin = memo(({
    CreateUnitAdmin,
}) => {
    return (
        <Col span={24}>
            <SignUpForm handleSubmit={CreateUnitAdmin} />
        </Col>
    )
})

const AddUnitAdminContainer = () => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        unitAdminMutationsGQL.CREATE_UNIT_ADMIN,
        {
            name: 'CreateUnitAdmin',
            options: {
                onCompleted: () => {
                    notification.success({ description: intl.formatMessage({ id: 'notification.unit_admin_create_success' }) })
                },
                onError: error => {
                    notification.error({
                        message: intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            },
        },
    )(AddUnitAdmin)
    return <WithGraphQL />
}

export default AddUnitAdminContainer