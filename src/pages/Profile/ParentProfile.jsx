import React from 'react'
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
                <Title>Parent Профиль</Title>
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
                        header='Дети'
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