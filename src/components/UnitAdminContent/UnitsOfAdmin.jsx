import React from "react"
import { Space, List } from "antd"
import { useQuery } from "@apollo/client"
import { PropTypes } from 'prop-types'

import ListItem from "@/components/ListItem"
import { robboUnitQuerysGQL } from "@/graphQL/query"

const RobboUnitsOfRobboAdmin = ({ unitAdminId }) => {

    const { data, loading } = useQuery(robboUnitQuerysGQL.GET_ROBBO_UNITS_BY_UNIT_ADMIN_ID, {
        variables: { unitAdminId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                loading={loading}
                bordered
                dataSource={data?.GetRobboUnitsByUnitAdminId.robboUnits}
                renderItem={(robboUnit, index) => {
                    return <ListItem
                        itemIndex={index}
                        key={index}
                        label={`${robboUnit?.name}`}
                        render={() => { }}
                    />
                }}
            />
        </Space>
    )
}

RobboUnitsOfRobboAdmin.propTypes = {
    unitAdminId: PropTypes.string.isRequired,
}

export default RobboUnitsOfRobboAdmin