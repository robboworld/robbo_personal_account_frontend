import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PageLayout, Card } from "@/layouts";
import { MainContainer, WelcomeText } from "./components";
import SideBar from "@/components/SideBar";

import { checkAuthRequest, getAllProjectPages } from '@/actions';
import { getIsAuth } from '@/reducers/login';
import { getProjectPages } from "@/reducers/projectPage";
import useIsAuth from "@/helpers/Hooks/useIsAuth";

import ProjectPageItem from "./ProjectPageItem";
import Flex from "@/components/Flex";
import ControlPanel from "@/components/ControlPanel";

export default () => {
    const dispath = useDispatch()
    useIsAuth()

    const token = localStorage.getItem('token')
    useEffect(() => {
        dispath(getAllProjectPages(token))
    }, [])

    const projectPages = useSelector(state => getProjectPages(state.projectPage))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction={"column"} align={"center"} >
                    <WelcomeText>Мои проекты</WelcomeText>
                    <ControlPanel />
                    {
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