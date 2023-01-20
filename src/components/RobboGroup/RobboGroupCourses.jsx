import React from "react"
import { Col, Row, List, notification } from "antd"
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { coursePageQuerysGQL } from "@/graphQL"

const RobboGroupCourses = ({ robboGroupId }) => {
    const { loading, error, data } = useQuery(coursePageQuerysGQL.GET_COURSES_BY_ROBBO_GROUP_ID, {
        variables: { robboGroupId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })
    console.log(data)
    if (error)
        notification.error({ message: 'Ошибка', description: error.message })
    return (
        <Row>
            <Col span={24}>
                {
                    loading
                        ? <Loader />
                        : (
                            <List
                                bordered
                                dataSource={data?.GetCoursesByRobboGroupId.results}
                                renderItem={(coursePage, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        label={`${coursePage.name}`}
                                        key={index}
                                        render={() => { }}
                                    />
                                )}
                            />
                        )
                }
            </Col>
        </Row>
    )
}

export default RobboGroupCourses