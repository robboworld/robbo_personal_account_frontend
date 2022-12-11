import React, { useEffect, useState, memo } from 'react'
import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'

import { WelcomeText } from '../Clients/components'

import PageLayout from '@/components/PageLayout'
import { checkAccess, useUserIdentity } from '@/helpers'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { getProfileState } from '@/reducers/profile'
import ProfileCard from '@/components/ProfileCard/ProfileCard'
import { FREE_LISTENER, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, PARENT, STUDENT, SUPER_ADMIN, TEACHER, UNIT_ADMIN } from '@/constants'
import ListChildren from '@/components/ListChildren'
import {
    clearProfileState,
    updateProfile,
    getProfileById,
} from '@/actions'

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
        return redirect(HOME_PAGE_ROUTE)
    } else if (!isAuth && !loginLoading) {
        return redirect(LOGIN_PAGE_ROUTE)
    }

    const token = localStorage.getItem('token')

    const actions = useActions({
        getProfileById,
        clearProfileState,
        updateProfile,
    }, [])

    const { loading, profile } = useSelector(({ profile }) => getProfileState(profile))
    const isUserAParent = checkAccess(userRole, [PARENT])

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [
            STUDENT,
            PARENT,
            TEACHER,
            UNIT_ADMIN,
            SUPER_ADMIN,
            FREE_LISTENER,
        ]))
            actions.getProfileById(token)
        return () => {
            actions.clearProfileState()
        }
    }, [loginLoading])

    return (
        <PageLayout>
            <WelcomeText>Profile</WelcomeText>
            {
                loading || loginLoading
                    ? <Loader />
                    : (
                        <Flex direction='row'>
                            <Flex margin='0.5rem' justify='flex-end'>
                                <ProfileCard updateHandle={actions.updateProfile} profile={profile}
                                    isUserAParent={isUserAParent} />
                            </Flex>
                            <Flex margin='0.5rem' width='100%'>
                                <ListChildren profile={profile} isUserAParent={isUserAParent} />
                            </Flex>
                        </Flex>
                    )
            }
        </PageLayout >
    )
})