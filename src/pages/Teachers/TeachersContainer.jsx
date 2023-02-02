import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import Teachers from './Teachers'

import { teacherQuerysGQL } from '@/graphQL'

const TeachersContainer = () => {
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
    teacherQuerysGQL.GET_ALL_TEACHERS,
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
    (Teachers)

export default TeachersContainer