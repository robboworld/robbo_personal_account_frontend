import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { WelcomeText } from './components'

import ProjectPageItem from './MyProjectsItem'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'

import { getMyProjectsLoading, getProjectPages } from '@/reducers/myProjects'
import Flex from '@/components/Flex'
import ControlPanel from '@/components/ControlPanel'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, STUDENT } from '@/constants'
import { checkAccess, useUserIdentity } from '@/helpers'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const { getAllProjectPages, clearMyProjectsState } = useActions()
    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [STUDENT]))
            getAllProjectPages(token)
        return () => {
            clearMyProjectsState()
        }
    }, [loginLoading])

    const projectPages = useSelector(state => getProjectPages(state.myProjects))
    const loading = useSelector(state => getMyProjectsLoading(state.myProjects))

    if (!loginLoading && !checkAccess(userRole, [STUDENT])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                {
                    loginLoading ? <Loader />
                        : (
                            <Flex direction='column' align='center' >
                                <WelcomeText>Мои проекты</WelcomeText>
                                <ControlPanel />

                                {loading
                                    ? <Loader />
                                    : projectPages?.map((projectPage, index) => {
                                        return (
                                            <ProjectPageItem
                                                projectPage={projectPage}
                                                projectPageIndex={index}
                                                key={index}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        )
                }

            </Card>
        </PageLayout>
    )
}