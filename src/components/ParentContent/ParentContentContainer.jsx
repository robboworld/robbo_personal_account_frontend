import React from 'react'
import { compose } from 'redux'
import { useIntl } from 'react-intl'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import ParentContent from './ParentContent'

import { parentMutationsGQL, parentQuerysGQL } from '@/graphQL'

const ParentContentContainer = ({
    parentId,
}) => {
    const intl = useIntl()
    return (
        <WithGraphQLComponent
            intl={intl}
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
    (ParentContent)

export default ParentContentContainer