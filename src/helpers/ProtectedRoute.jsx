import React from 'react'
import { Navigate } from 'react-router-dom'

import { LOGIN_PAGE_ROUTE } from '@/constants'

export const ProtectedRoute = ({
    isAllowed,
    redirectPath = LOGIN_PAGE_ROUTE,
    children,
}) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />
    }

    return children || null
}