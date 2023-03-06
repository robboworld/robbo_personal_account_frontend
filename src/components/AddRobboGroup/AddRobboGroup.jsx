import React, { memo } from 'react'
import { PropTypes } from 'prop-types'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import RobboGroupForm from '@/components/RobboGroupForm'
import { robboGroupMutationsGQL } from "@/graphQL"


const AddRobboGroup = memo(({
    robboUnitId,
    CreateRobboGroup,
}) => {
    console.log(robboUnitId)
    return (
        <Col span={24}>
            <RobboGroupForm
                robboUnitId={robboUnitId}
                handleSubmit={CreateRobboGroup}
            />
        </Col>
    )
})

const AddRobboUnitContainer = ({ robboUnitId }) => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        robboGroupMutationsGQL.CREATE_ROBBO_GROUP,
        {
            name: 'CreateRobboGroup',
            options: {
                onCompleted: () => {
                    notification.success({ description: intl.formatMessage({ id: 'notification.robbo_group_create_success' }) })
                },
                onError: error => {
                    notification.error({
                        message: intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            },
        },
    )(AddRobboGroup)
    return <WithGraphQL robboUnitId={robboUnitId} />
}

AddRobboGroup.propTypes = {
    robboUnitId: PropTypes.string,
    CreateRobboGroup: PropTypes.func,
}

export default AddRobboUnitContainer