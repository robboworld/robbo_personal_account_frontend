import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Typography, Skeleton } from 'antd'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const UnitAdminProfile = ({
    data: {
        GetUser,
        loading,
    },
    UpdateUnitAdmin,
    accessUpdate,
}) => {
    return (
        <PageLayout>
            <Row align='middle'>
                <Title><FormattedMessage id='profile.title' /></Title>
            </Row>
            <Row>
                <Skeleton active loading={loading}>
                    <ProfileCard
                        profile={GetUser?.userHttp}
                        updateHandle={UpdateUnitAdmin}
                        accessUpdate={accessUpdate}
                    />
                </Skeleton>

            </Row>
        </PageLayout>
    )
}

export default UnitAdminProfile