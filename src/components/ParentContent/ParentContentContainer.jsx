import React from 'react'
import { graphql } from '@apollo/client/react/hoc'

import ParentContent from './ParentContent'

import { parentQuerysGQL } from '@/graphQL'

const ParentContentContainer = ({ parentId }) => {
    return (
        <WithGraphQLComponent
            parentId={parentId}
        />
    )
}

const WithGraphQLComponent = graphql(
    parentQuerysGQL.GET_PARENT_BY_ID,
    {
        options: props => {
            return {
                variables: {
                    parentId: props.parentId,
                },
            }
        },
    })
    (ParentContent)

export default ParentContentContainer