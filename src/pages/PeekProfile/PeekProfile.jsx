import React from 'react'
import { useSelector } from 'react-redux'

import { useQuery } from "@apollo/client"

import PageLayout from '@/components/PageLayout'
import { checkAccess, useUserIdentity } from '@/helpers'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { SUPER_ADMIN } from '@/constants'
import ProfileCard from '@/components/ProfileCard'

import { userGQL } from '@/graphQL'

export default ({ location }) => {

    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const isUserSuperAdmin = checkAccess(userRole, [SUPER_ADMIN])

    const {
        updateProfile,
    } = useActions()

    const { loading, error, data } = useQuery(userGQL.GET_STUDENT_BY_ID, {
        variables: { studentId: location.state.studentId },
        notifyOnNetworkStatusChange: true,
    })

    const token = localStorage.getItem('token')

    return (
        <PageLayout>
            {
                loginLoading || loading
                    ? <Loader />
                    : data === undefined
                        ? <h3>Not finded</h3>
                        : isUserSuperAdmin
                            ? <ProfileCard updateHandle={updateProfile} profile={data.GetStudentById?.userHttp} />
                            : <ProfileCard profile={data.GetStudentById?.userHttp} />
            }
        </PageLayout>
    )
}