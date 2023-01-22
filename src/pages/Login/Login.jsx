import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import { useUserIdentity } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'

import { getLoginState } from '@/reducers/login'

export default () => {
    // const { isAuth } = useSelector(({ login }) => getLoginState(login))
    // if (isAuth) {
    //     return <Navigate to={HOME_PAGE_ROUTE} />
    // }
    const token = localStorage.getItem('token')
    if (token) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    }
    return (
        <PageLayoutLogin />
    )
}