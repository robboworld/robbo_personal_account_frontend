import React from "react"
import { useNavigate } from "react-router-dom"
import { Button, Tabs } from "antd"

import RobboUnitStudentsTab from "./RobboUnitStudentsTab"

import RobboUnitCard from "@/components/RobboUnitCard"
import Flex from '@/components/Flex'
import RobboUnitAccessSetting from "@/components/RobboUnitAccessSetting"

export default ({ robboUnitId }) => {
    const history = useNavigate()

    return (
        <Flex width='100%'>
            <Flex
                direction='column' width='100%'
                padding='0.5rem'
            >
                Robbo Unit
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            label: 'Карточка',
                            key: '1',
                            children: <RobboUnitCard robboUnitId={robboUnitId} />,
                        },
                        {
                            label: 'Группы',
                            key: '2',
                            children: <Button onClick={() => history(`/robboUnits/${robboUnitId}/groups`)}>Группы</Button>,
                        },
                        {
                            label: 'Доступ',
                            key: '3',
                            children: <RobboUnitAccessSetting robboUnitId={robboUnitId} />,
                        },
                        {
                            label: 'Ученики',
                            key: '4',
                            children: <RobboUnitStudentsTab robboUnitId={robboUnitId} />,
                        },
                    ]}
                />
            </Flex>
        </Flex >
    )
}