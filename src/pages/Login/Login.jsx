import React from 'react'
import { Redirect } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

import { useUserIdentity } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'
import PageLayoutLogin from '@/components/PageLayoutLogin'

export default () => {
    const { isAuth, loginLoading } = useUserIdentity()

    if (isAuth) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    }

    return (
        <React.Fragment>
            {
                loginLoading
                    ? <LoadingOutlined />
                    : <PageLayoutLogin />
            }
        </React.Fragment>

    )
}