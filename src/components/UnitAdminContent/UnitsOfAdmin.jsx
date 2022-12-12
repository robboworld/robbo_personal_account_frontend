import React from "react"
import { Space, List } from "antd"
import { useQuery } from "@apollo/client"

import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { robboUnitGQL } from "@/graphQL/query"

export default ({ unitAdminId }) => {

    const { data, loading } = useQuery(robboUnitGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID, {
        variables: { unitAdminId: unitAdminId },
        notifyOnNetworkStatusChange: true,
    })

    console.log(data)
    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            {
                loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={data?.GetRobboUnitsByUnitAdminId?.robboUnits}
                        renderItem={({ robboUnitHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${robboUnitHttp.name}`}
                                render={() => { }}
                            />
                        )}
                    />
            }
        </Space>
    )
}