import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useIntl } from 'react-intl'

import TeacherContent from './TeacherContent'

import { teacherMutationsGQL, teacherQuerysGQL } from '@/graphQL'

const TeacherContentContainer = ({ teacherId }) => {
    const intl = useIntl()
    const WithGraphQLComponent = compose(
        graphql(teacherQuerysGQL.GET_TEACHER_BY_ID,
            {
                options: props => {
                    return {
                        variables: {
                            teacherId: props.teacherId,
                        },
                    }
                },
            }),
        graphql(teacherMutationsGQL.UPDATE_TEACHER,
            {
                name: 'UpdateTeacher',
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
        (TeacherContent)

    return (
        <WithGraphQLComponent
            teacherId={teacherId}
        />
    )
}

export default TeacherContentContainer