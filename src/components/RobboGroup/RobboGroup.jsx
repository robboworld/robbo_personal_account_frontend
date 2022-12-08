import React from "react"
import { Tabs } from "antd"
import { PropTypes } from 'prop-types'

import RobboGroupStudentsTab from "./RobboGroupStudentsTab"
import RobboGroupCard from "./RobboGroupCard"

import RobboGroupTeachersTab from "./RobboGroupTeachersTab"

import Flex from '@/components/Flex'

const RobboGroup = ({ robboUnitId, robboGroupId, disableСhanges }) => {
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
                            children:
                                <RobboGroupCard
                                    robboGroupId={robboGroupId} disableСhanges={disableСhanges}
                                />,
                        },
                        {
                            label: 'Ученики',
                            key: '2',
                            children:
                                <RobboGroupStudentsTab
                                    robboGroupId={robboGroupId} robboUnitId={robboUnitId}
                                    disableСhanges={disableСhanges}
                                />,
                        },
                        {
                            label: 'Педагоги',
                            key: '3',
                            children: <RobboGroupTeachersTab robboGroupId={robboGroupId} />,
                        },
                    ]}
                />
            </Flex >
        </Flex>
    )
}

RobboGroup.propTypes = {
    robboUnitId: PropTypes.string.isRequired,
    robboGroupId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboGroup