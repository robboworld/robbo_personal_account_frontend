import React from 'react'
import { Row, Col, List, notification } from 'antd'
import { useIntl } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'
import { useSearchParams, useNavigate } from 'react-router-dom'

import ListItem from '@/components/ListItem'
import { coursePageQuerysGQL } from '@/graphQL'
import { PROFILE_PAGE_ROUTE, TEACHER } from "@/constants"

const CurrentCourseAccessTeachers = ({
    courseId,
    data: {
        GetTeachersAdmittedToTheCourse,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    const navigate = useNavigate()
    const openProfileTeacher = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: TEACHER,
            },
        })
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                <List
                    bordered
                    loading={loading}
                    dataSource={GetTeachersAdmittedToTheCourse?.teachers}
                    pagination={{
                        onChange: onChangePage,
                        total: GetTeachersAdmittedToTheCourse?.countRows,
                        current: +currentPage,
                        defaultCurrent: 1,
                        defaultPageSize: pageSize,
                        responsive: true,
                    }}
                    renderItem={({ userHttp }, index) => (
                        <ListItem
                            itemIndex={index}
                            key={index}
                            render={() => { }}
                            label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                            handleClick={() => openProfileTeacher(userHttp.id)}
                        />
                    )}
                />
            </Col>
        </Row>
    )
}

const CurrentCourseAccessTeachersContainer = ({ courseId }) => {
    const intl = useIntl()
    const WithGraphQL = graphql(
        coursePageQuerysGQL.GET_TEACHERS_ADMITTED_TO_THE_COURSE,
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
    )(CurrentCourseAccessTeachers)

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

export default CurrentCourseAccessTeachersContainer