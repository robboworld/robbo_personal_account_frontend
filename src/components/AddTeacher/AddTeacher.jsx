import React, { memo } from 'react'
import { Col, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import SignUpForm from '@/components/SignUpForm'
import { teacherMutationsGQL } from '@/graphQL'


const AddTeacher = memo(({
    CreateTeacher,
}) => {
    return (
        <Col span={24}>
            <SignUpForm handleSubmit={CreateTeacher} />
        </Col>
    )
})

const AddTeacherContainer = () => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        teacherMutationsGQL.CREATE_TEACHER,
        {
            name: 'CreateTeacher',
            options: {
                onCompleted: () => {
                    notification.success({ description: intl.formatMessage({ id: 'notification.teacher_create_success' }) })
                },
                onError: error => {
                    notification.error({
                        message: intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            },
        },
    )(AddTeacher)
    return <WithGraphQL />
}

export default AddTeacherContainer