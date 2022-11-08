import React, { useState } from "react"
import { Redirect } from "react-router-dom"

import { WelcomeText } from "./components"

import { PageLayout, Card } from '@/layouts'
import { Button, DragResize } from "@/components/UI"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { useUserIdentity, checkAccess } from "@/helpers"
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, TEACHER } from "@/constants"
import RobboGroupsList from "@/components/RobboGroupsList"

export default () => {

    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const [openRobboGroupList, setOpenRobboGroupList] = useState(false)

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
                <DragResize
                    open={openRobboGroupList} setOpen={setOpenRobboGroupList}
                    content={() => (
                        <RobboGroupsList />
                    )}
                />
                <Flex direction='column' margin='0 1rem 0 0'
                    style={{ maxWidth: '250px' }}>
                    <Button
                        content='Расписание'
                        background='darkgreen'
                        margin='1rem 0 0 0' padding='0.5rem'
                    // handleSubmit={}
                    />
                    <Button
                        content='Группы'
                        background='darkgreen'
                        margin='1rem 0 0 0' padding='0.5rem'
                        handleSubmit={() => setOpenRobboGroupList(!openRobboGroupList)}
                    />
                    <Button
                        content='Индивидуальные ученики'
                        background='darkgreen'
                        margin='1rem 0 0 0' padding='0.5rem'
                    />
                    <Button
                        content='Курсы'
                        background='darkgreen'
                        margin='1rem 0 0 0' padding='0.5rem'
                    />
                </Flex>
            </Card>
        </PageLayout>
    )
}