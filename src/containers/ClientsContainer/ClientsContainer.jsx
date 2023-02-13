import React from 'react'
import { useIntl } from 'react-intl'
import { notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import Clients from '@/pages/Clients'

import { parentQuerysGQL } from '@/graphQL'


const ClientsPageContainer = () => {
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
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

const WithGraphQLComponent = graphql(
    parentQuerysGQL.GET_ALL_PARENTS,
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
    })
    (Clients)

export default ClientsPageContainer