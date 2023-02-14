import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { notification } from 'antd'
import { compose } from 'redux'
import { graphql } from '@apollo/client/react/hoc'

import RobboUnitStudentsTab from './RobboUnitStudentsTab'

import { studentQuerysGQL } from '@/graphQL'


const RobboUnitStudentsTabContainer = ({
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
        email={email}
        SearchStudent={SearchStudent}
    />
}

const WithGraphQLComponent = compose(
    graphql(
        studentQuerysGQL.GET_STUDENTS_BY_ROBBO_UNIT_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboUnitId: props.robboUnitId,
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
    ))(RobboUnitStudentsTab)

export default RobboUnitStudentsTabContainer