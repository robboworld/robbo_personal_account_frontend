import React, { useEffect, memo } from 'react'
import { useSelector } from 'react-redux'

import PageLayout from '@/components/PageLayout'
import { checkAccess } from '@/helpers'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { getProfileState } from '@/reducers/profile'
import ProfileCard from '@/components/ProfileCard/ProfileCard'
import { PARENT } from '@/constants'
import ListChildren from '@/components/ListChildren'
import {
    clearProfileState,
    updateProfile,
    getProfileById,
} from '@/actions'

export default memo(({ userRole }) => {
    const token = localStorage.getItem('token')

    const actions = useActions({
        getProfileById,
        clearProfileState,
        updateProfile,
    }, [])

    const { loading, profile } = useSelector(({ profile }) => getProfileState(profile))
    const isUserAParent = checkAccess(userRole, [PARENT])

    useEffect(() => {
        actions.getProfileById(token)
        return () => {
            actions.clearProfileState()
        }
    }, [])

    return (
        <PageLayout>
            Profile
            {
                loading
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