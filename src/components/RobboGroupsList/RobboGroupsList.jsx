import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { List, Space } from "antd"

import ListItem from "@/components/ListItem"
import { DragResize } from "@/components/UI"
import RobboGroup from "@/components/RobboGroup"
import { useActions } from "@/helpers"
import { getRobboGroupsState } from "@/reducers/robboGroups"
import {
    getRobboGroupsByAccessTokenRequest,
    getRobboGroupsByTeacherId,
    clearRobboGroupsPage,
} from '@/actions'


export default ({ teacherId }) => {
    const actions = useActions({ getRobboGroupsByAccessTokenRequest, getRobboGroupsByTeacherId, clearRobboGroupsPage }, [])
    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))
    useEffect(() => {
        if (teacherId) {
            actions.getRobboGroupsByTeacherId(teacherId)
        } else {
            actions.getRobboGroupsByAccessTokenRequest("1", "10")
        }
        return () => {
            actions.clearRobboGroupsPage()
        }
    }, [])


    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                loading={loading}
                bordered
                dataSource={robboGroups}
                renderItem={(robboGroup, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        label={robboGroup.name}
                        render={(open, setOpen) => (
                            <DragResize
                                open={open} setOpen={setOpen}
                                content={() => (
                                    <RobboGroup
                                        robboUnitId={robboGroup.robboUnitId}
                                        robboGroupId={robboGroup.id}
                                        disableСhanges
                                    />
                                )}
                            />
                        )}
                    />
                )}
            />
        </Space>
    )
}

// TODO propTypes