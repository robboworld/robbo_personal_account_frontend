import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, Col, Typography, Skeleton, List } from 'antd'

import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'

const { Title } = Typography

const ParentProfile = ({
    GetUser,
    GetStudents,
    UpdateParent,
    accessUpdate,
}) => {
    return (
        <PageLayout>
            <Row align='middle'>
                <Title><FormattedMessage id='profile.title' /></Title>
            </Row>
            <Row justify='start'>
                <Col span={8}>
                    <Skeleton active loading={GetUser?.loading}>
                        <ProfileCard
                            profile={GetUser?.GetUser?.userHttp}
                            updateHandle={UpdateParent}
                            accessUpdate={accessUpdate}
                        />
                    </Skeleton>
                </Col>
                <Col span={12}>
                    <List
                        header={<FormattedMessage id='parent_profile.header_children_list' />}
                        bordered
                        loading={GetStudents?.loading}
                        dataSource={GetStudents.GetStudentsByParentId?.students}
                        renderItem={({ userHttp }) => (
                            <List.Item
                                key={userHttp.email}
                            >
                                {`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default ParentProfile