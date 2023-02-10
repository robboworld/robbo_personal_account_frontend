import React from 'react'
import { useIntl } from 'react-intl'
import { Col, Row, List, notification } from 'antd'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import ListItem from '@/components/ListItem'
import { coursePageQuerysGQL } from '@/graphQL'

const RobboGroupCourses = ({
    data: {
        GetCoursesByRobboGroupId,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    return (
        <Row>
            <Col span={24}>
                <List
                    loading={loading}
                    bordered
                    dataSource={GetCoursesByRobboGroupId?.results}
                    renderItem={(coursePage, index) => (
                        <ListItem
                            itemIndex={index}
                            label={`${coursePage.name}`}
                            key={index}
                            render={() => { }}
                        />
                    )}
                />

            </Col>
        </Row>
    )
}

const RobboGroupCoursesContainer = ({
    robboGroupId,
}) => {
    const intl = useIntl()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }
    const WithGraphQLComponent = graphql(
        coursePageQuerysGQL.GET_COURSES_BY_ROBBO_GROUP_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboGroupId: props.robboGroupId,
                    },
                    onError: error => {
                        notification.error({
                            message: intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        })
        (RobboGroupCourses)
    return (
        <WithGraphQLComponent
            robboGroupId={robboGroupId}
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

export default RobboGroupCoursesContainer