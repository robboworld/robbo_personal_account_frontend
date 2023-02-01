import React from 'react'
import { Skeleton, Tabs } from 'antd'

import GroupsTab from './GroupsTab'

import ProfileCard from '@/components/ProfileCard'

const TeacherContent = ({
    teacherId,
    data: {
        GetTeacherById,
        loading,
    },
    UpdateTeacher,
}) => {
    return (
        <Tabs
            title='Карточка педагога'
            defaultActiveKey='1'
            items={[
                {
                    label: 'Профиль',
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard updateHandle={UpdateTeacher} profile={GetTeacherById?.userHttp} />,
                },
                {
                    label: 'Группы',
                    key: '2',
                    children: <GroupsTab teacherId={teacherId} />,
                },
                {
                    label: 'Курсы',
                    key: '3',
                    children: 'Курсы',
                },
            ]}
        />
    )
}

export default TeacherContent