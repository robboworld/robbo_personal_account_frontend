import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { notification } from 'antd'
import { compose } from 'redux'
import { graphql } from '@apollo/client/react/hoc'

import RobboGroupStudentsTab from './RobboGroupStudentsTab'

import { studentQuerysGQL } from '@/graphQL'


const RobboGroupStudentsTabContainer = ({
    robboGroupId,
    robboUnitId,
}) => {
    const [email, setEmail] = useState('')
    const SearchStudent = value => {
        setEmail(value)
    }
    const intl = useIntl()

    return <WithGraphQLComponent
        intl={intl}
        robboUnitId={robboUnitId}
        robboGroupId={robboGroupId}
        email={email}
        SearchStudent={SearchStudent}
    />
}

const WithGraphQLComponent = compose(
    graphql(
        studentQuerysGQL.GET_STUDENTS_BY_ROBBO_GROUP_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboGroupId: props.robboGroupId,
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'GetStudents',
        },
    ),
    graphql(
        studentQuerysGQL.SEARCH_STUDENTS_BY_EMAIL,
        {
            options: props => {
                return {
                    variables: {
                        email: props.email || 'undenfined',
                        page: "1",
                        pageSize: "5",
                        parentId: props.parentId,
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'SearchStudentsResult',
        },
    ))(RobboGroupStudentsTab)

export default RobboGroupStudentsTabContainer