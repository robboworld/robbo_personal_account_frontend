import React from 'react'
import { Row, Col, List, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { coursePageQuerysGQL } from '@/graphQL'
import { PROFILE_PAGE_ROUTE, TEACHER } from "@/constants"

const CurrentCourseAccessTeachers = ({ courseId }) => {

    const { loading, error, data } = useQuery(coursePageQuerysGQL.GET_TEACHERS_ADMITTED_TO_THE_COURSE, {
        variables: { courseId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })
    if (error)
        notification.error({ message: 'Ошибка', description: error.message })

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
                {loading ? <Loader /> : (
                    <List
                        bordered
                        dataSource={data.GetTeachersAdmittedToTheCourse.teachers}
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
                )}

            </Col>
        </Row>
    )
}

export default CurrentCourseAccessTeachers