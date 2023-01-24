import React from 'react'
import { Row, Typography, Skeleton } from 'antd'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const UnitAdminProfile = ({
    data: {
        GetUser,
        loading,
    },
}) => {
    return (
        <PageLayout>
            <Row align='middle'>
                <Title>Parent Профиль</Title>
            </Row>
            <Row>
                <Skeleton active loading={loading}>
                    <ProfileCard profile={GetUser?.userHttp} />
                </Skeleton>

            </Row>
        </PageLayout>
    )
}

export default UnitAdminProfile