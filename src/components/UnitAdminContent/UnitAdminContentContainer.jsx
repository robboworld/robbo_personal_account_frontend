import React from 'react'
import { compose } from 'redux'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'

import UnitAdminContent from './UnitAdminContent'

import { unitAdminMutationsGQL, unitAdminQuerysGQL } from '@/graphQL'

const UnitAdminContentContainer = ({ unitAdminId }) => {
    return (
        <WithGraphQLComponent
            unitAdminId={unitAdminId}
        />
    )
}

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
                    notification.success({ description: 'Профиль успешно обновлен!' })
                },
                onError: error => {
                    notification.error({ message: 'Ошибка', description: error?.message })
                },
            },
        },
    ))
    (UnitAdminContent)

export default UnitAdminContentContainer