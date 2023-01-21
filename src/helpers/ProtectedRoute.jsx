import React from 'react'
import { Navigate } from 'react-router-dom'

import { useUserIdentity } from './useUserIdentity'
import { checkAccess } from './checkAccess'

import { LOGIN_PAGE_ROUTE } from '@/constants'

export const ProtectedRoute = ({
    isAllowed,
    allowedRoles = [],
    redirectPath = LOGIN_PAGE_ROUTE,
    children,
}) => {
    const { userRole, isAuth } = useUserIdentity()
    if (!isAuth && !checkAccess(userRole, allowedRoles)) {
        return <Navigate to={redirectPath} replace />
    }

    return children || null
}