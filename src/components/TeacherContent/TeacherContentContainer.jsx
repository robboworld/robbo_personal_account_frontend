import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useIntl } from 'react-intl'

import TeacherContent from './TeacherContent'

import { teacherMutationsGQL, teacherQuerysGQL } from '@/graphQL'

const TeacherContentContainer = ({ teacherId }) => {
    const intl = useIntl()

    return (
        <WithGraphQLComponent
            intl={intl}
            teacherId={teacherId}
        />
    )
}

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
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.update_profile_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    ))
    (TeacherContent)


export default TeacherContentContainer