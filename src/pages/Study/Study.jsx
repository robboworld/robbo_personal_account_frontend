import React from "react"
import { Navigate } from "react-router-dom"
import { Tabs } from "antd"

import TeacherCourses from "./TeacherCourses"

import PageLayout from '@/components/PageLayout'
import RobboGroupsList from "@/components/RobboGroupsList"

export default () => {
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
                        children: <TeacherCourses />,
                    },
                ]}
            />
        </PageLayout>
    )
}