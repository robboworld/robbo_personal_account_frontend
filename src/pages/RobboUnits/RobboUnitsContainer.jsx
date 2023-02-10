import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'
import { compose } from 'redux'
import { useIntl } from 'react-intl'

import RobboUnits from './RobboUnits'

import { robboUnitQuerysGQL } from '@/graphQL'
import { SUPER_ADMIN, UNIT_ADMIN } from '@/constants'

const RobboUnitsContainer = ({ userRole }) => {
    const intl = useIntl()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    return (
        <WithGraphQLComponent
            intl={intl}
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
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
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            skip: props => props.userRole === SUPER_ADMIN,
            name: 'GetRobboUnitsUnitAdmin',
        }),
)(RobboUnits)

export default RobboUnitsContainer