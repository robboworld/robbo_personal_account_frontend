import React from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import MyCourses from './MyCourses'

import { coursePageQuerysGQL } from '@/graphQL'

const MyCoursesContainer = () => {
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
    coursePageQuerysGQL.GET_COURSES_BY_USER,
    {
        options: props => {
            return {
                variables: {
                    page: props.currentPage,
                    pageSize: props.pageSize,
                },
            }
        },
    })
    (MyCourses)

export default MyCoursesContainer