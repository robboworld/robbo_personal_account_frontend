import React from 'react'
import { Row, Skeleton, Typography } from 'antd'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const SuperAdminProfile = ({
    data: {
        GetUser,
        loading,
    },
    UpdateSuperAdmin,
    accessUpdate,
}) => {
    return (
        <PageLayout>
            <Row align='middle'>
                <Title>Super Admin Профиль</Title>
            </Row>
            <Row>
                <Skeleton active loading={loading}>
                    <ProfileCard
                        profile={GetUser?.userHttp}
                        updateHandle={UpdateSuperAdmin}
                        accessUpdate={accessUpdate}
                    />
                </Skeleton>
            </Row>
        </PageLayout>

    )
}

export default SuperAdminProfile