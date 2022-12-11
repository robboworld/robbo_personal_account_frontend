import React from 'react'
import { redirect } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import { useUserIdentity } from '@/helpers'
import { HOME_PAGE_ROUTE, PROFILE_PAGE_ROUTE } from '@/constants'

export default () => {
    const { isAuth, loginLoading } = useUserIdentity()

    if (isAuth && !loginLoading) {
        return redirect(PROFILE_PAGE_ROUTE)
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