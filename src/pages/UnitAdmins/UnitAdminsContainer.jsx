import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import UnitAdmins from './UnitAdmins'

import { unitAdminQuerysGQL } from '@/graphQL'

const UnitAdminsContainer = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    return (
        <WithGraphQLComponent
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

const WithGraphQLComponent = graphql(
    unitAdminQuerysGQL.GET_ALL_UNIT_ADMINS,
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
    })
    (UnitAdmins)

export default UnitAdminsContainer