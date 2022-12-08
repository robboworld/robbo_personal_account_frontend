import React from "react"
import { Space, List } from "antd"
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { userGQL, robboUnitGQL } from "@/graphQL/query"

export default ({ adminId }) => {
    const token = localStorage.getItem('token')

    const getRobboUnitsByUnitAdminIdResult = useQuery(robboUnitGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID, {
        variables: { unitAdminId: adminId },
        notifyOnNetworkStatusChange: true,
    })

    console.log(getRobboUnitsByUnitAdminIdResult)

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            {
                getRobboUnitsByUnitAdminIdResult?.loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={getRobboUnitsByUnitAdminIdResult.data.getRobboUnitsByUnitAdminId}
                        renderItem={({ RobboUnitHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${RobboUnitHttp.name}`}
                                render={() => { }}
                            />
                        )}
                    />
            }
        </Space>
    )
}