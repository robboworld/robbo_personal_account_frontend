import React from 'react'
import { Navigate } from 'react-router-dom'

import { useUserIdentity } from './useUserIdentity'
import { checkAccess } from './checkAccess'

import { LOGIN_PAGE_ROUTE, HOME_PAGE_ROUTE } from '@/constants'

export const ProtectedRoute = ({
    allowedRoles = [],
    redirectPath = LOGIN_PAGE_ROUTE,
    children,
}) => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    if (!loginLoading && !checkAccess(userRole, allowedRoles)) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }
    return children || null
}