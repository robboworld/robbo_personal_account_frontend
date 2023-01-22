import React from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'
import { compose } from 'redux'

import RobboGroups from './RobboGroups'

import { robboGroupQuerysGQL } from '@/graphQL'
import { SUPER_ADMIN, UNIT_ADMIN } from '@/constants'

const RobboGroupsContainer = ({ userRole }) => {
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
        robboGroupQuerysGQL.GET_ALL_ROBBO_GROUPS,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                }
            },
            skip: props => props.userRole === UNIT_ADMIN,
            name: 'GetRobboGroupsSuperAdmin',
        }),
    graphql(
        robboGroupQuerysGQL.GET_ALL_ROBBO_GROUPS_FOR_UNIT_ADMIN,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                }
            },
            skip: props => props.userRole === SUPER_ADMIN,
            name: 'GetRobboGroupsUnitAdmin',
        }),
    graphql(
        robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_ROBBO_UNIT_ID,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                }
            },
            skip: props => props.userRole === SUPER_ADMIN,
            name: 'GetRobboGroupsByRobboUnitId',
        }),
)(RobboGroups)

export default RobboGroupsContainer