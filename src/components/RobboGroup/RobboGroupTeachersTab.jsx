import React from "react"
import { Space, List } from "antd"
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { userGQL } from "@/graphQL/query"

export default ({ robboGroupId }) => {
    const token = localStorage.getItem('token')

    const getTeachersByRobboGroupIdResult = useQuery(userGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID, {
        variables: { robboGroupId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            {
                getTeachersByRobboGroupIdResult?.loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={getTeachersByRobboGroupIdResult.data.GetTeachersByRobboGroupId}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                render={() => { }}
                            />
                        )}
                    />
            }
        </Space>
    )
}
