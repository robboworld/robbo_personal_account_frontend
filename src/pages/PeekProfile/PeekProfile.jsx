import React from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from "@apollo/client"

import PageLayout from '@/components/PageLayout'
import { checkAccess, useUserIdentity } from '@/helpers'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { SUPER_ADMIN, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'
import ProfileCard from '@/components/ProfileCard'
import { userGQL } from '@/graphQL'
import { updateProfile } from '@/actions'

export default ({ location }) => {

    const { userRole, isAuth, loginLoading } = useUserIdentity()
    if (!loginLoading && !checkAccess(userRole,
        [SUPER_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }

    const actions = useActions({ updateProfile }, [])

    const { loading, error, data } = useQuery(userGQL.GET_STUDENT_BY_ID, {
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