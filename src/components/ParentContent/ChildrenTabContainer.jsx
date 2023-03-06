import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { compose } from 'redux'
import { graphql } from '@apollo/client/react/hoc'

import ChildrenTab from './ChildrenTab'

import { studentMutationsGQL, studentQuerysGQL } from '@/graphQL'
import { STUDENT, PROFILE_PAGE_ROUTE } from '@/constants'

const ChildrenTabContainer = ({
    parentId,
    intl,
}) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const SearchStudent = value => { setEmail(value) }
    const openProfileStudent = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: STUDENT,
            },
        })
    }

    return <WithGraphQLComponent
        intl={intl}
        parentId={parentId}
        email={email}
        SearchStudent={SearchStudent}
        openProfileStudent={openProfileStudent}
    />
}

const WithGraphQLComponent = compose(
    graphql(
        studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID,
        {
            options: props => {
                return {
                    variables: {
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
            name: 'GetStudents',
        },
    ),
    graphql(
        studentQuerysGQL.SEARCH_STUDENTS_BY_EMAIL,
        {
            options: props => {
                return {
                    variables: {
                        email: props.email,
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
    ),
    graphql(
        studentMutationsGQL.CREATE_STUDENT_PARENT_RELATION,
        {
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.child_create_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'CreateStudentParentRelation',
        },
    ),
    graphql(
        studentMutationsGQL.DELETE_STUDENT,
        {
            options: props => {
                return {
                    onCompleted: () => {
                        notification.success({ description: props.intl.formatMessage({ id: 'notification.child_delete_success' }) })
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'DeleteStudent',
        },
    ),
)(ChildrenTab)


export default ChildrenTabContainer