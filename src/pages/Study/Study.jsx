import React from "react"
import { Redirect } from "react-router-dom"

import { WelcomeText } from "./components"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { useUserIdentity, checkAccess } from "@/helpers"
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, TEACHER } from "@/constants"

export default () => {

    const { userRole, isAuth, loginLoading } = useUserIdentity()


    if (!loginLoading && !checkAccess(userRole, [TEACHER])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Обучение</WelcomeText>
                <Flex>
                    Ghbdnt
                </Flex>
            </Card>
        </PageLayout>
    )
}