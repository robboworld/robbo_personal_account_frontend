import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { List, Space } from "antd"

import { Text } from './components'

import Loader from "@/components//Loader"
import ListItem from "@/components/ListItem"
import { DragResize } from "@/components/UI"
import RobboGroup from "@/components/RobboGroup"
import { useActions } from "@/helpers"

import { getRobboGroupsState } from "@/reducers/robboGroups"


export default ({ teacherId }) => {
    const { getRobboGroupsByAccessToken, getRobboGroupsByTeacherId } = useActions()
    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))
    useEffect(() => {
        if (teacherId) {
            getRobboGroupsByTeacherId(teacherId)
        } else {
            getRobboGroupsByAccessToken()
        }
    }, [])


    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <Text>Назначенные группы</Text>
            {
                loading ? <Loader />
                    : <List
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
                                            // refactor in robboGroup useQuery
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
            }
        </Space>
    )
}