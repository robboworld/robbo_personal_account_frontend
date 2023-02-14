import React from "react"
import { useIntl } from 'react-intl'
import { Col, Row, List, notification } from "antd"
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams } from 'react-router-dom'

import ListItem from "@/components/ListItem"
import { coursePageQuerysGQL } from "@/graphQL"

const RobboUnitCourses = ({
    data: {
        GetCoursesByRobboUnitId,
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
                    dataSource={GetCoursesByRobboUnitId?.results}
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

const RobboUnitCoursesContainer = ({
    robboUnitId,
}) => {
    const intl = useIntl()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const pageSize = '10'

    const onChangePage = page => {
        setSearchParams({ page })
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            robboUnitId={robboUnitId}
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={onChangePage}
        />
    )
}

const WithGraphQLComponent = graphql(
    coursePageQuerysGQL.GET_COURSES_BY_ROBBO_UNIT_ID,
    {
        options: props => {
            return {
                variables: {
                    robboUnitId: props.robboUnitId,
                    page: props.page,
                    pageSize: props.pageSize,
                },
                onError: error => {
                    notification.error({
                        message: props.intl.formatMessage({ id: 'notification.error_message' }),
                        description: error?.message,
                    })
                },
            }
        },
    })
    (RobboUnitCourses)

export default RobboUnitCoursesContainer