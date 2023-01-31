import React from 'react'
import { Row, Col, List, notification } from 'antd'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import ListItem from '@/components/ListItem'
import Loader from '@/components/Loader'
import { coursePageQuerysGQL } from '@/graphQL'
import { PROFILE_PAGE_ROUTE, UNIT_ADMIN } from "@/constants"

const CurrentCourseAccessUnitAdmins = ({ courseId }) => {

    const { loading, error, data } = useQuery(coursePageQuerysGQL.GET_UNIT_ADMINS_ADMITTED_TO_THE_COURSE, {
        variables: { courseId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })
    if (error)
        notification.error({ message: 'Ошибка', description: error.message })

    const navigate = useNavigate()
    const openProfileUnitAdmin = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: UNIT_ADMIN,
            },
        })
    }

    return (
        <Row gutter={[0, 8]}>
            <Col span={24}>
                {loading ? <Loader /> : (
                    <List
                        bordered
                        dataSource={data.GetUnitAdminsAdmittedToTheCourse.unitAdmins}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => openProfileUnitAdmin(userHttp.id)}
                            />
                        )}
                    />
                )}

            </Col>
        </Row>
    )
}

export default CurrentCourseAccessUnitAdmins