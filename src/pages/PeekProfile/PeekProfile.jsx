import React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from "@apollo/client"

import PageLayout from '@/components/PageLayout'
import Loader from '@/components/Loader'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers'
import { studentQuerysGQL } from '@/graphQL'
import { updateProfile } from '@/actions'

export default () => {
    const location = useLocation()
    const actions = useActions({ updateProfile }, [])

    const { loading, error, data } = useQuery(studentQuerysGQL.GET_STUDENT_BY_ID, {
        variables: { studentId: location.state.studentId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <PageLayout>
            {
                loading
                    ? <Loader />
                    : <ProfileCard updateHandle={actions.updateProfile} profile={data.GetStudentById?.userHttp} />
            }
        </PageLayout>
    )
}