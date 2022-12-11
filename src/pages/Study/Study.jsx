import React from "react"
import { redirect } from "react-router-dom"
import { Tabs } from "antd"

import PageLayout from '@/components/PageLayout'
import { useUserIdentity, checkAccess } from "@/helpers"
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, TEACHER } from "@/constants"
import RobboGroupsList from "@/components/RobboGroupsList"


export default () => {

    const { userRole, isAuth, loginLoading } = useUserIdentity()

    if (!loginLoading && !checkAccess(userRole, [TEACHER])) {
        return redirect(HOME_PAGE_ROUTE)
    } else if (!isAuth && !loginLoading) {
        return redirect(LOGIN_PAGE_ROUTE)
    }

    return (
        <PageLayout>
            Обучение
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