import React, { memo } from 'react'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import SignUpForm from '@/components/SignUpForm'
import { studentMutationsGQL } from '@/graphQL'

const AddChild = memo(({
    parentId,
    robboGroupId,
    robboUnitId,
    CreateStudent,
}) => {
    return (
        <Col span={24}>
            <SignUpForm
                handleSubmit={CreateStudent}
                robboGroupId={robboGroupId}
                robboUnitId={robboUnitId}
            />
        </Col >
    )
})

const AddChildContainer = ({
    parentId,
    robboGroupId,
    robboUnitId,
}) => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        studentMutationsGQL.CREATE_STUDENT,
        {
            name: 'CreateStudent',
            options: props => {
                return {
                    variables: {
                        parentId: props.parentId,
                    },
                    onCompleted: () => {
                        notification.success({ description: intl.formatMessage({ id: 'notification.child_create_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    )(AddChild)
    return <WithGraphQL
        parentId={parentId}
        robboGroupId={robboGroupId}
        robboUnitId={robboUnitId}
    />
}

export default AddChildContainer