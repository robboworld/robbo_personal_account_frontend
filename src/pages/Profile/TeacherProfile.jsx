import React from 'react'
import { Row, Typography, Skeleton } from 'antd'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const TeacherProfile = ({
    data: {
        GetUser,
        loading,
    },
    UpdateTeacher,
    accessUpdate,
}) => {
    return (
        <PageLayout>
            <Row align='middle'>
                <Title>Teacher Профиль</Title>
            </Row>
            <Row>
                <Skeleton active loading={loading}>
                    <ProfileCard
                        profile={GetUser?.userHttp}
                        updateHandle={UpdateTeacher}
                        accessUpdate={accessUpdate}
                    />
                </Skeleton>

            </Row>
        </PageLayout>
    )
}

export default TeacherProfile