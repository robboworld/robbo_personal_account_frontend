import React from "react"
import { Tabs, Typography } from "antd"
import { FormattedMessage } from 'react-intl'

import TeacherCourses from "./TeacherCourses"

import PageLayout from '@/components/PageLayout'
import RobboGroupsList from "@/components/RobboGroupsList"

const { Title } = Typography

export default () => {
    return (
        <PageLayout>
            <Title>
                <FormattedMessage id='study.title' />
            </Title>
            <Tabs
                defaultActiveKey='2'
                items={[
                    {
                        label: <FormattedMessage id='study.schedule_item' />,
                        key: '1',
                        children: 'Расписание',
                    },
                    {
                        label: <FormattedMessage id='study.robbo_groups_item' />,
                        key: '2',
                        children: <RobboGroupsList />,
                    },
                    {
                        label: <FormattedMessage id='study.individual_students_item' />,
                        key: '3',
                        children: 'Индивидуальные ученики',
                    },
                    {
                        label: <FormattedMessage id='study.courses_item' />,
                        key: '4',
                        children: <TeacherCourses />,
                    },
                ]}
            />
        </PageLayout>
    )
}