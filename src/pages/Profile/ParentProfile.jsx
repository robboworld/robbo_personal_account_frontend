import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Typography, Skeleton, List } from 'antd'


import PageLayout from '@/components/PageLayout'
import ProfileCard from '@/components/ProfileCard'
import { PROFILE_PAGE_ROUTE } from '@/constants'
import ListItem from '@/components/ListItem'

const { Title } = Typography

const ParentProfile = ({
    GetUser,
    GetStudents,
    UpdateParent,
    accessUpdate,
}) => {
    const navigate = useNavigate()
    const openProfileStudent = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: 0,
            },
        })
    }

    return (
        <PageLayout>
            <Row align='middle'>
                <Title><FormattedMessage id='profile.title' /></Title>
            </Row>
            <Row justify='start' gutter={[8, 8]}>
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
                            <ListItem
                                key={userHttp.email}
                                handleClick={() => openProfileStudent(userHttp.id)}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                            />
                        )}
                    />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default ParentProfile