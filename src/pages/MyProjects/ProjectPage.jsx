import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { PageLayout, Card } from "@/layouts";
import { MainContainer, WelcomeText } from "./components";
import SideBar from "@/components/SideBar";

import { checkAuthRequest } from '@/actions';
import { getIsAuth } from '@/reducers/login';
import { getProjectPages } from "@/reducers/projectPage";
import ProjectPageItem from "./ProjectPageItem";
import Flex from "@/components/Flex";
import ControlPanel from "@/components/ControlPanel";

export default () => {
    // TO DO написать hook проверки авторизации
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(checkAuthRequest())
        }
    }, [])

    const isAuth = useSelector(state => getIsAuth(state.login))
    const projectPages = useSelector(state => getProjectPages(state.projectPage))

    if (!isAuth) {
        return <Redirect to={"/login"} />;
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction={"column"} align={"center"} >
                    <WelcomeText>Мои проекты</WelcomeText>
                    <ControlPanel />
                    {
                        projectPages.map((projectPage, index) => {
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