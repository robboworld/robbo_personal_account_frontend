import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import TeacherContent from './TeacherContent'

import { teacherMutationsGQL, teacherQuerysGQL } from '@/graphQL'

const TeacherContentContainer = ({ teacherId }) => {
    return (
        <WithGraphQLComponent
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
            options: {
                onCompleted: () => {
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ))
    (TeacherContent)

export default TeacherContentContainer