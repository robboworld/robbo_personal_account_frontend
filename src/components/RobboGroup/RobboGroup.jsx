import React from "react"
import { Tabs } from "antd"


import RobboGroupStudentsTab from "./RobboGroupStudentsTab"
import RobboGroupCard from "./RobboGroupCard"

import Flex from '@/components/Flex'

export default ({ robboUnitId, robboGroupId }) => {
    return (
        <Flex width='100%'>
            <Flex
                direction='column' width='100%'
                padding='0.5rem'
            >
                Группа
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            label: 'Карточка',
                            key: '1',
                            children: <RobboGroupCard robboGroupId={robboGroupId} />,
                        },
                        {
                            label: 'Ученики',
                            key: '2',
                            children: <RobboGroupStudentsTab robboGroupId={robboGroupId} robboUnitId={robboUnitId} />,
                        },
                        {
                            label: 'Педагоги',
                            key: '3',
                            children: "Педагоги",
                        },
                    ]}
                />
            </Flex >
        </Flex>
    )
}