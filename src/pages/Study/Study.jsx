import React, { useState } from "react"
import { Redirect } from "react-router-dom"
import { Tabs } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import { DragResize } from "@/components/UI"
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
            <WelcomeText>Обучение</WelcomeText>
            <DragResize
                open={openRobboGroupList} setOpen={setOpenRobboGroupList}
                content={() => (
                    <RobboGroupsList />
                )}
            />
            <Tabs
                defaultActiveKey='2'
                items={[
                    {
                        label: 'Расписание',
                        key: '1',
                        children: 'Расписание',
                    },
                    {
                        label: 'Группы',
                        key: '2',
                        children: <RobboGroupsList />,
                    },
                    {
                        label: 'Индивидуальные ученики',
                        key: '3',
                        children: 'Индивидуальные ученики',
                    },
                    {
                        label: 'Курсы',
                        key: '4',
                        children: 'Курсы',
                    },
                ]}
            />
        </PageLayout>
    )
}