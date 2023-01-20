import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from "@apollo/client"

import PageLayout from '@/components/PageLayout'
import Loader from '@/components/Loader'
import ProfileCard from '@/components/ProfileCard'
import { checkAccess, useUserIdentity, useActions } from '@/helpers'
import { SUPER_ADMIN, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'
import { studentQuerysGQL } from '@/graphQL'
import { updateProfile } from '@/actions'

export default () => {
    const location = useLocation()
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }

    const actions = useActions({ updateProfile }, [])

    const { loading, error, data } = useQuery(studentQuerysGQL.GET_STUDENT_BY_ID, {
        variables: { studentId: location.state.studentId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <PageLayout>
            {
                loginLoading || loading
                    ? <Loader />
                    : <ProfileCard updateHandle={actions.updateProfile} profile={data.GetStudentById?.userHttp} />
            }
        </PageLayout>
    )
}