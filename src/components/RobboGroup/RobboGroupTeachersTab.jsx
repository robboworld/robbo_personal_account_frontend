import React from "react"
import { Space, List } from "antd"
import { useNavigate } from 'react-router-dom'
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { teacherQuerysGQL } from "@/graphQL/query"
import { PROFILE_PAGE_ROUTE } from "@/constants"

export default ({ robboGroupId }) => {

    const navigate = useNavigate()
    const getTeachersByRobboGroupIdResult = useQuery(teacherQuerysGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID, {
        variables: { robboGroupId },
        notifyOnNetworkStatusChange: true,
    })

    const openProfileTeacher = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: 1,
            },
        })
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            {
                getTeachersByRobboGroupIdResult?.loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={getTeachersByRobboGroupIdResult.data.GetTeachersByRobboGroupId.teachers}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                render={() => { }}
                                handleClick={() => openProfileTeacher(userHttp.id)}
                            />
                        )}
                    />
            }
        </Space>
    )
}
