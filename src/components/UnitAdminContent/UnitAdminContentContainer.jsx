import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import UnitAdminContent from './UnitAdminContent'

import { unitAdminMutationsGQL, unitAdminQuerysGQL } from '@/graphQL'

const UnitAdminContentContainer = ({ unitAdminId }) => {
    const intl = useIntl()
    const WithGraphQLComponent = compose(
        graphql(
            unitAdminQuerysGQL.GET_UNIT_ADMIN_BY_ID,
            {
                options: props => {
                    return {
                        variables: {
                            unitAdminId: props.unitAdminId,
                        },
                    }
                },
            }),
        graphql(unitAdminMutationsGQL.UPDATE_UNIT_ADMIN,
            {
                name: 'UpdateUnitAdmin',
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
        (UnitAdminContent)
    return (
        <WithGraphQLComponent
            unitAdminId={unitAdminId}
        />
    )
}



export default UnitAdminContentContainer