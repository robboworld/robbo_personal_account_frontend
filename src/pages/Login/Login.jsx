import React from 'react'
import { Navigate } from 'react-router-dom'

import PageLayoutLogin from '@/components/PageLayoutLogin'
import { HOME_PAGE_ROUTE } from '@/constants'

export default () => {
    const token = localStorage.getItem('token')
    if (token) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    }
    return (
        <PageLayoutLogin />
    )
}