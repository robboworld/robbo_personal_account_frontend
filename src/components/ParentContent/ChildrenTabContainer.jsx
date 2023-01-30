import React, { useState } from 'react'
import { compose } from 'redux'
import { graphql } from '@apollo/client/react/hoc'

import ChildrenTab from './ChildrenTab'

import { studentQuerysGQL } from '@/graphQL'


const ChildrenTabContainer = ({
    parentId,
}) => {
    const [email, setEmail] = useState('')
    const SearchStudent = value => {
        console.log(value)
        setEmail(value)
    }

    return <WithGraphQLComponent
        parentId={parentId}
        email={email}
        SearchStudent={SearchStudent}
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
                        parentId: props.parentId,
                    },
                }
            },
            name: 'SearchStudentsResult',
        },
    ))(ChildrenTab)

export default ChildrenTabContainer