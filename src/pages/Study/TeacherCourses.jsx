import React, { useEffect } from "react"
import { Col, notification, Row, Spin } from "antd"
import { useSelector } from "react-redux"
import { useIntl } from "react-intl"
import { graphql } from "@apollo/client/react/hoc"

import { useActions } from "@/helpers/useActions"
import {
    getCoursePagesByUserRequest,
    clearAllCoursePagesState,
} from '@/actions'
import { getCoursePagesState } from "@/reducers/myCourses"
import ListItem from "@/components/ListItem"
import { coursePageQuerysGQL, teacherQuerysGQL } from "@/graphQL"




const TeacherCourses = ({
    data: {
        GetCoursesByUser,
        loading,
    },
}) => {
    return (
        <Row>
            <Col span={24} >
                {
                    loading
                        ? <Spin />
                        : GetCoursesByUser?.results?.map((coursePage, index) => {
                            return (
                                <ListItem
                                    itemIndex={index}
                                    label={`${coursePage.name}`}
                                    key={index}
                                    render={() => { }}
                                />
                            )
                        })
                }
            </Col>
        </Row>
    )
}

const TeacherCoursesContainer = () => {
    const intl = useIntl()

    return (
        <WithGraphQLComponent
            intl={intl}
        />
    )
}

const WithGraphQLComponent = graphql(
    coursePageQuerysGQL.GET_COURSES_BY_USER,
    {
        options: props => {
            return {
                variables: {
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
    (TeacherCourses)

export default TeacherCoursesContainer