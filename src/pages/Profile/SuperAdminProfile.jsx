import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, Row, Skeleton, Typography } from 'antd'

import { getProfileFromQuery } from './profileQuery'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const SuperAdminProfile = ({
    data,
    UpdateSuperAdmin,
    accessUpdate,
}) => {
    const { profile, loading, error } = getProfileFromQuery(data)

    return (
        <PageLayout>
            <Row align='middle'>
                <Title><FormattedMessage id='profile.title' /></Title>
            </Row>
            <Row>
                {error && (
                    <Alert
                        type='error'
                        showIcon
                        message={error.message || String(error)}
                        style={{ marginBottom: 16, width: '100%' }}
                    />
                )}
                <Skeleton active loading={loading}>
                    <ProfileCard
                        profile={profile}
                        updateHandle={UpdateSuperAdmin}
                        accessUpdate={accessUpdate}
                    />
                </Skeleton>
            </Row>
        </PageLayout>
    )
}

export default SuperAdminProfile
