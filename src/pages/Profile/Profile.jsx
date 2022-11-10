import React, { useEffect, useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'


import { WelcomeText } from '../Clients/components'

import PageLayout from '@/components/PageLayout'
import { checkAccess, useUserIdentity } from '@/helpers'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { getProfileState } from '@/reducers/profile'
import ProfileCard from '@/components/ProfileCard/ProfileCard'
import { FREE_LISTENER, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, PARENT, STUDENT, SUPER_ADMIN, TEACHER, UNIT_ADMIN } from '@/constants'


export default memo(() => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    if (!loginLoading && !checkAccess(userRole,
        [
            STUDENT,
            PARENT,
            TEACHER,
            UNIT_ADMIN,
            SUPER_ADMIN,
            FREE_LISTENER,
        ])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    const token = localStorage.getItem('token')
    const { getProfileById } = useActions()

    const {
        deleteProfile,
        clearProfileState,
        updateProfile,
    } = useActions()

    const { loading, profile } = useSelector(({ profile }) => getProfileState(profile))

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [
            STUDENT,
            PARENT,
            TEACHER,
            UNIT_ADMIN,
            SUPER_ADMIN,
            FREE_LISTENER,
        ]))
            getProfileById(token)
        return () => {
            clearProfileState()
        }
    }, [loginLoading])

    return (
        <PageLayout>
            <WelcomeText>Profile</WelcomeText>
            {
                loading || loginLoading
                    ? <Loader />
                    : (
                        <Flex direction='column'>
                            <Flex margin='0.5rem' justify='flex-end'>
                                <ProfileCard updateHandle={updateProfile} profile={profile} />
                            </Flex>
                        </Flex>
                    )
            }
        </PageLayout >
    )
})