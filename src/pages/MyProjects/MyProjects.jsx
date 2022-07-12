import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"

import { PageLayout, Card } from "@/layouts"
import { MainContainer, WelcomeText } from "./components"
import SideBar from "@/components/SideBar"

import { getIsAuth } from '@/reducers/login'
import { getMyProjectsLoading, getProjectPages } from "@/reducers/myProjects"
import { useIsAuth } from "@/helpers/useIsAuth"

import ProjectPageItem from "./MyProjectsItem"
import Flex from "@/components/Flex"
import ControlPanel from "@/components/ControlPanel"
import Loader from "@/components/Loader"
import { useActions } from "@/helpers/useActions"

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
                <Flex direction="column" align="center" >
                    <WelcomeText>Мои проекты</WelcomeText>
                    <ControlPanel />

                    {loading ?
                        <Loader /> :
                        projectPages?.map((projectPage, index) => {
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