import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Alert, Row, Typography, Skeleton } from 'antd'

import { getProfileFromQuery } from './profileQuery'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const StudentProfile = ({
    data,
    UpdateStudent,
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
                        updateHandle={UpdateStudent}
                        accessUpdate={accessUpdate}
                    />
                </Skeleton>
            </Row>
        </PageLayout>
    )
}

export default StudentProfile
