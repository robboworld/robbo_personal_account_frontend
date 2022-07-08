import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { MainContainer, WelcomeText } from "./components"
import SideBar from "@/components/SideBar"

import { checkAuthRequest, getAllProjectPages } from '@/actions'
import { getIsAuth } from '@/reducers/login'
import { getMyProjectsLoading, getProjectPages } from "@/reducers/myProjects"
import { useIsAuth } from "@/helpers/useIsAuth"

import ProjectPageItem from "./MyProjectsItem"
import Flex from "@/components/Flex"
import ControlPanel from "@/components/ControlPanel"
import Loader from "@/components/Loader"

export default () => {
    const dispath = useDispatch()
    useIsAuth()

    const token = localStorage.getItem('token')
    useEffect(() => {
        dispath(getAllProjectPages(token))
    }, [])

    const projectPages = useSelector(state => getProjectPages(state.myProjects))
    const loading = useSelector(state => getMyProjectsLoading(state.myProjects))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction="column" align="center" >
                    <WelcomeText>Мои проекты</WelcomeText>
                    <ControlPanel />

                    {loading ?
                        <Loader /> :
                        projectPages?.map((projectPage, index) => {
                            return (
                                <ProjectPageItem
                                    projectPage={projectPage}
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