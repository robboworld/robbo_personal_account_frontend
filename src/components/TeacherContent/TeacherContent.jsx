import React from 'react'
import { Skeleton, Tabs } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

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
    const intl = useIntl()
    return (
        <Tabs
            title={intl.formatMessage({ id: 'teacher_content.title' })}
            defaultActiveKey='1'
            items={[
                {
                    label: <FormattedMessage id='teacher_content.profile' />,
                    key: '1',
                    children: loading ? <Skeleton active loading={loading} />
                        : <ProfileCard
                            updateHandle={UpdateTeacher}
                            profile={GetTeacherById?.userHttp}
                        />,
                },
                {
                    label: <FormattedMessage id='teacher_content.robbo_groups_item' />,
                    key: '2',
                    children: loading ? <Skeleton active loading={loading} />
                        : <GroupsTab teacherId={teacherId} />,
                },
                {
                    label: <FormattedMessage id='teacher_content.courses_item' />,
                    key: '3',
                    children: 'Курсы',
                },
            ]}
        />
    )
}

export default TeacherContent