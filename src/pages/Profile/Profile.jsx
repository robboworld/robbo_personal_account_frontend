import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Avatar } from '../CoursePage/components'

import { Headind } from './components'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import { useIsAuth } from '@/helpers'
import { getProfileLoading } from '@/reducers/profile'
import Loader from '@/components/Loader'
import Flex from '@/components/Flex'

export default () => {
    useIsAuth()

    useEffect(() => {
        // getProfileById(token, projectPageId)
        return () => {
            // clearProfileState()
        }
    }, [])


    const loading = useSelector(state => getProfileLoading(state.profile))

    return (
        <PageLayout>
            <Card>
                <Headind>Profile</Headind>
                <SideBar />
                {
                    loading
                        ? <Loader />
                        : (
                            <Flex>
                                <Avatar />
                            </Flex>
                        )
                }
            </Card>
        </PageLayout>
    )
}