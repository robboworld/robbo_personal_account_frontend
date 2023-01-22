import React from 'react'
import { Row, Col, List, notification } from 'antd'
import { useQuery } from '@apollo/client'

import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { coursePageQuerysGQL } from '@/graphQL'

const CurrentCourseAccessStudents = ({ courseId }) => {

    const { loading, error, data } = useQuery(coursePageQuerysGQL.GET_STUDENTS_ADMITTED_TO_THE_COURSE, {
        variables: { courseId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })
    if (error)
        notification.error({ message: 'Ошибка', description: error.message })

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
                            // handleClick={() => actions.createCourseAccessRelationRobboUnitRequest(courseId, robboUnit.id)}
                            />
                        )}
                    />
                )}

            </Col>
        </Row>
    )
}

export default CurrentCourseAccessStudents