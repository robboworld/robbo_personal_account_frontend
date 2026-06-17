import React from 'react'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { compose } from 'redux'

import MyProjects from './MyProjects'

import { projectPageMutationGQL, projectPageQueryGQL } from '@/graphQL'

const MyProjectsContainer = () => {
    const intl = useIntl()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '5'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    const WithGraphQLComponent = compose(
        graphql(
            projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN,
            {
                options: props => {
                    return {
                        fetchPolicy: 'network-only',
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
                name: 'GetProjectPages',
            }),
        graphql(
            projectPageMutationGQL.DELETE_PROJECT_PAGE,
            {
                options: props => {
                    return {
                        refetchQueries: [
                            {
                                query: projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN,
                                variables: {
                                    page: props.currentPage,
                                    pageSize: props.pageSize,
                                },
                            },
                        ],
                        onCompleted: () => {
                            notification.success({ description: props.intl.formatMessage({ id: 'notification.project_page_deleted_success' }) })
                        },
                        onError: error => {
                            notification.error({
                                message: props.intl.formatMessage({ id: 'notification.error_message' }),
                                description: error?.message,
                            })
                        },
                    }
                },
                name: 'DeleteProjectPage',
            },
        ),
        graphql(
            projectPageMutationGQL.CREATE_PROJECT_PAGE,
            {
                options: props => {
                    return {
                        onCompleted: data => {
                            const created = data?.CreateProjectPage
                            if (created?.projectPageId) {
                                navigate(`/projects/${created.projectPageId}`)
                            }
                        },
                        onError: error => {
                            notification.error({
                                message: props.intl.formatMessage({ id: 'notification.error_message' }),
                                description: error?.message,
                            })
                        },
                    }
                },
                name: 'CreateProjectPage',
            },
        ),
    )
        (MyProjects)

    return (
        <WithGraphQLComponent
            intl={intl}
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

export default MyProjectsContainer