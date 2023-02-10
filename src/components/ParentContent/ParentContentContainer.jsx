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
        (ParentContent)
    return (
        <WithGraphQLComponent
            parentId={parentId}
        />
    )
}



export default ParentContentContainer