import React from 'react'
import { useQuery } from "@apollo/client"
import { Tabs } from 'antd'

import GroupsTab from './GroupsTab'

import Loader from '@/components//Loader'
import Flex from '@/components/Flex'
import ProfileCard from '@/components/ProfileCard'
import { useActions } from '@/helpers/useActions'
import { updateProfile } from '@/actions'
import { teacherQuerysGQL } from '@/graphQL'

export default ({ teacherId }) => {
    const actions = useActions({ updateProfile }, [])

    const { loading, error, data } = useQuery(teacherQuerysGQL.GET_TEACHER_BY_ID, {
        variables: { teacherId },
    })

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'
            >
                Карточка педагога
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            label: 'Профиль',
                            key: '1',
                            children: loading ? <Loader /> : <ProfileCard updateHandle={actions.updateProfile} profile={data.GetTeacherById?.userHttp} />,
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
            </Flex>
        </Flex>
    )
}