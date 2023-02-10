import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'


import MyCourses from './MyCourses'

import { coursePageQuerysGQL } from '@/graphQL'

const MyCoursesContainer = () => {
    const intl = useIntl()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    const WithGraphQLComponent = graphql(
        coursePageQuerysGQL.GET_COURSES_BY_USER,
        {
            options: props => {
                return {
                    variables: {
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                    onError: error => {
                        notification.error({
                            message: intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        })
        (MyCourses)

    return (
        <WithGraphQLComponent
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}



export default MyCoursesContainer