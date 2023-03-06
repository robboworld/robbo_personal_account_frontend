import React from 'react'
import { Col, Row, Typography, List } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import PageLayout from '@/components/PageLayout'
import ListItem from '@/components/ListItem'

const { Title } = Typography

const MyCourses = ({
    data: {
        GetCoursesByUser,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    const navigate = useNavigate()

    return (
        <PageLayout>
            <Row align='middle'>
                <Col span={24}>
                    <Title>
                        <FormattedMessage id='my_courses.title' />
                    </Title>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        loading={loading}
                        bordered
                        size='large'
                        dataSource={GetCoursesByUser?.results}
                        pagination={{
                            onChange: onChangePage,
                            total: GetCoursesByUser?.countRows || 10,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={(coursePage, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${coursePage.name}`}
                                handleClick={() => navigate(`/courses/${coursePage.id}`)}
                                render={(open, setOpen) => { }}
                            />
                        )}
                    />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default MyCourses