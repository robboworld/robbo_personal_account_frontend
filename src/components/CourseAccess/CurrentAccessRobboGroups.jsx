import React from 'react'
import { Row, Col, List, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import ListItem from '@/components/ListItem'
import { coursePageQuerysGQL } from '@/graphQL'

const CurrentCourseAccessRobboGroups = ({
    courseId,
    data: {
        GetRobboGroupsAdmittedToTheCourse,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <List
                    loading={loading}
                    bordered
                    dataSource={GetRobboGroupsAdmittedToTheCourse?.robboGroups}
                    pagination={{
                        onChange: onChangePage,
                        total: GetRobboGroupsAdmittedToTheCourse?.countRows,
                        current: +currentPage,
                        defaultCurrent: 1,
                        defaultPageSize: pageSize,
                        responsive: true,
                    }}
                    renderItem={(robboGroup, index) => (
                        <ListItem
                            itemIndex={index}
                            key={index}
                            render={() => { }}
                            label={`${robboGroup.name}`}
                        />
                    )}
                />
            </Col>
        </Row>
    )
}

const CurrentCourseAccessRobboGroupsContainer = ({ courseId }) => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        coursePageQuerysGQL.GET_ROBBO_GROUPS_ADMITTED_TO_THE_COURSE,
        {
            options: props => {
                return {
                    variables: {
                        courseId: props.courseId,
                        page: props.currentPage,
                        pageSize: props.pageSize,
                    },
                    onError: error => {
                        notification.error({
                            message: intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
        },
    )(CurrentCourseAccessRobboGroups)

    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    return <WithGraphQL
        courseId={courseId}
        pageSize={pageSize}
        currentPage={currentPage}
        onChangePage={onChangePage}
    />
}

export default CurrentCourseAccessRobboGroupsContainer