import React from "react"
import { graphql } from "@apollo/client/react/hoc"
import { Space, List } from "antd"
import { useNavigate } from 'react-router-dom'

import ListItem from "@/components/ListItem"
import { teacherQuerysGQL } from "@/graphQL/query"
import { PROFILE_PAGE_ROUTE, TEACHER } from "@/constants"

const RobboGroupTeachersTab = ({
    data: {
        GetTeachersByRobboGroupId,
        loading,
    },
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
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                bordered
                loading={loading}
                dataSource={GetTeachersByRobboGroupId?.teachers}
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
        </Space>
    )
}

const RobboGroupTeachersTabContainer = ({ robboGroupId }) => {
    const WithGraphQLComponent = graphql(
        teacherQuerysGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboGroupId: props.robboGroupId,
                    },
                }
            },
        },
    )(RobboGroupTeachersTab)
    return (
        <WithGraphQLComponent
            robboGroupId={robboGroupId}
        />
    )
}

export default RobboGroupTeachersTabContainer
