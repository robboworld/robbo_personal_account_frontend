import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, List, notification } from 'antd'
import { useQuery } from '@apollo/client'

import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { coursePageQuerysGQL } from '@/graphQL'
import { PROFILE_PAGE_ROUTE, STUDENT } from "@/constants"

const CurrentCourseAccessStudents = ({ courseId }) => {

    const { loading, error, data } = useQuery(coursePageQuerysGQL.GET_STUDENTS_ADMITTED_TO_THE_COURSE, {
        variables: { courseId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })
    if (error)
        notification.error({ message: 'Ошибка', description: error.message })

    const navigate = useNavigate()
    const openProfileStudent = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: STUDENT,
            },
        })
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                {loading ? <Loader /> : (
                    <List
                        bordered
                        dataSource={data.GetStudentsAdmittedToTheCourse.students}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => openProfileStudent(userHttp.id)}
                            />
                        )}
                    />
                )}

            </Col>
        </Row>
    )
}

export default CurrentCourseAccessStudents