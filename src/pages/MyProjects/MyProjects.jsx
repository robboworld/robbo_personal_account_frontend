import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { WelcomeText } from './components'

import ProjectPageItem from './MyProjectsItem'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'

import { getMyProjectsLoading, getProjectPages } from '@/reducers/myProjects'
import { useIsAuth } from '@/helpers/useIsAuth'


import Flex from '@/components/Flex'
import ControlPanel from '@/components/ControlPanel'
import Loader from '@/components/Loader'
import { useActions } from '@/helpers/useActions'

export default () => {
    useIsAuth()

    const { getAllProjectPages, clearMyProjectsState } = useActions()

    const token = localStorage.getItem('token')
    useEffect(() => {
        getAllProjectPages(token)
        return () => {
            clearMyProjectsState()
        }
    }, [])

    const projectPages = useSelector(state => getProjectPages(state.myProjects))
    const loading = useSelector(state => getMyProjectsLoading(state.myProjects))

    return (
        <PageLayout>
            <Card>
                <SideBar />
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
            </Card>
        </PageLayout>
    )
}