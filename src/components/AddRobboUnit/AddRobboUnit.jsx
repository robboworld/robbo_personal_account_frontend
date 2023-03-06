import React, { memo } from 'react'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import RobboUnitForm from '@/components/RobboUnitForm'
import { robboUnitMutationsGQL } from '@/graphQL'

const AddRobboUnit = memo(({
    CreateRobboUnit,
}) => {
    return (
        <Col span={24}>
            <RobboUnitForm
                handleSubmit={CreateRobboUnit}
            />
        </Col>
    )
})

const AddRobboUnitContainer = () => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        robboUnitMutationsGQL.CREATE_ROBBO_UNIT,
        {
            name: 'CreateRobboUnit',
            options: {
                onCompleted: () => {
                    notification.success({ description: intl.formatMessage({ id: 'notification.robbo_unit_create_success' }) })
                },
                onError: error => {
                    notification.error({
                        message: intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            },
        },
    )(AddRobboUnit)
    return <WithGraphQL />
}

export default AddRobboUnitContainer