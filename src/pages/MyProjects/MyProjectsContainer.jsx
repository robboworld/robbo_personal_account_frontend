import React, { useEffect } from 'react'
import { notification } from 'antd'
import { useMutation, useQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'

import MyProjects from './MyProjects'

import { projectPageMutationGQL, projectPageQueryGQL } from '@/graphQL'
import { openScratchEditor } from '@/utils/scratchEditor'

const PAGE_SIZE = '5'

const MyProjectsContainer = () => {
    const intl = useIntl()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const variables = { page: currentPage, pageSize: PAGE_SIZE }

    const notifyError = error => notification.error({
        message: intl.formatMessage({ id: 'notification.error_message' }),
        description: error?.message,
    })

    const projectPages = useQuery(projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN, {
        fetchPolicy: 'network-only',
        variables,
    })
    useEffect(() => {
        if (projectPages.error) {
            notifyError(projectPages.error)
        }
        // notifyError only formats the message; re-run on a new error, not on a new intl.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectPages.error])

    const [deleteProjectPage] = useMutation(projectPageMutationGQL.DELETE_PROJECT_PAGE, {
        refetchQueries: [{ query: projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN, variables }],
        onCompleted: () => notification.success({
            description: intl.formatMessage({ id: 'notification.project_page_deleted_success' }),
        }),
        onError: notifyError,
    })

    const [createProjectPage, createState] = useMutation(projectPageMutationGQL.CREATE_PROJECT_PAGE, {
        onCompleted: data => {
            const created = data?.CreateProjectPage
            if (created?.projectPageId) {
                openScratchEditor(created.projectPageId)
            }
        },
        onError: notifyError,
    })

    return (
        <MyProjects
            GetProjectPages={{ ...projectPages.data, loading: projectPages.loading, error: projectPages.error }}
            DeleteProjectPage={deleteProjectPage}
            CreateProjectPage={createProjectPage}
            creating={createState.loading}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onChangePage={page => setSearchParams({ page })}
        />
    )
}

export default MyProjectsContainer
