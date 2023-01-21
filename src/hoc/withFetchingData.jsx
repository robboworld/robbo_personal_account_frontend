import React from 'react'
import { notification } from 'antd'
import { useQuery } from '@apollo/client'

const withFetchingData = (
    WrappedComponent,
    fetchQuery,
    queryVariables,
) => {
    return props => {
        const { loading, error, data } = useQuery(fetchQuery, {
            variables: queryVariables,
            notifyOnNetworkStatusChange: true,
        },
        )
        if (error)
            notification.error({ message: 'Ошибка', description: error.message })
        return (
            <WrappedComponent
                data={data}
                loading={loading}
                {...props}
            />
        )

    }
}

export default withFetchingData