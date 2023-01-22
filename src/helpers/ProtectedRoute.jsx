import React from 'react'
import { Navigate } from 'react-router-dom'

import { parseJwt } from './jwtParser'

import { LOGIN_PAGE_ROUTE, HOME_PAGE_ROUTE } from '@/constants'

export const ProtectedRoute = ({
    allowedRoles = [],
    redirectPath = LOGIN_PAGE_ROUTE,
    children,
}) => {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to={LOGIN_PAGE_ROUTE} replace />
    } else {
        const { Role } = parseJwt(token)
        if (!allowedRoles.includes(Role))
            return <Navigate to={HOME_PAGE_ROUTE} replace />
    }

    const childrenWithProps = React.Children.map(children, child => {
        const { Role } = parseJwt(token)
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { userRole: Role })
        }
        return child
    })

    return childrenWithProps || null
}