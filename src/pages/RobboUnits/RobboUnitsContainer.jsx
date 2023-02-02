import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'
import { compose } from 'redux'

import RobboUnits from './RobboUnits'

import { robboUnitQuerysGQL } from '@/graphQL'
import { SUPER_ADMIN, UNIT_ADMIN } from '@/constants'

const RobboUnitsContainer = ({ userRole }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    return (
        <WithGraphQLComponent
            userRole={userRole}
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        robboUnitQuerysGQL.GET_ALL_ROBBO_UNITS,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
            skip: props => props.userRole === UNIT_ADMIN,
            name: 'GetRobboUnitsSuperAdmin',
        }),
    graphql(
        robboUnitQuerysGQL.GET_ROBBO_UNITS_BY_ACCESS_TOKEN,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                    onError: error => {
                        notification.error({ message: 'Ошибка', description: error?.message })
                    },
                }
            },
            skip: props => props.userRole === SUPER_ADMIN,
            name: 'GetRobboUnitsUnitAdmin',
        }),
)(RobboUnits)

export default RobboUnitsContainer