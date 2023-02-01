import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import ParentContent from './ParentContent'

import { parentMutationsGQL, parentQuerysGQL } from '@/graphQL'

const ParentContentContainer = ({ parentId }) => {
    return (
        <WithGraphQLComponent
            parentId={parentId}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        parentQuerysGQL.GET_PARENT_BY_ID,
        {
            options: props => {
                return {
                    variables: {
                        parentId: props.parentId,
                    },
                }
            },
        }),
    graphql(parentMutationsGQL.UPDATE_PARENT,
        {
            name: 'UpdateParent',
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
    (ParentContent)

export default ParentContentContainer