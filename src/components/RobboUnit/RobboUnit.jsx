import React from "react"
import { useNavigate } from "react-router-dom"
import { Button, Tabs } from "antd"
import { FormattedMessage, useIntl } from "react-intl"

import RobboUnitStudentsTabContainer from "./RobboUnitStudentsTabContainer"
import RobboUnitCourses from "./RobboUnitCourses"

import RobboUnitCard from "@/components/RobboUnitCard"
import RobboUnitAccessSetting from "@/components/RobboUnitAccessSetting"

export default ({ robboUnitId }) => {
    const history = useNavigate()
    const intl = useIntl()
    return (
        <Tabs
            title={intl.formatMessage({ id: 'robbo_unit.card_title' })}
            defaultActiveKey='1'
            items={[
                {
                    label: <FormattedMessage id='robbo_unit.card_item' />,
                    key: '1',
                    children: <RobboUnitCard robboUnitId={robboUnitId} />,
                },
                {
                    label: <FormattedMessage id='robbo_unit.robbo_groups_item' />,
                    key: '2',
                    children: (
                        <Button onClick={() => history(`/robboUnits/${robboUnitId}/groups`)}>
                            <FormattedMessage id='robbo_unit.robbo_groups_item' />
                        </Button>
                    ),
                },
                {
                    label: <FormattedMessage id='robbo_unit.access' />,
                    key: '3',
                    children: <RobboUnitAccessSetting robboUnitId={robboUnitId} />,
                },
                {
                    label: <FormattedMessage id='robbo_unit.students_item' />,
                    key: '4',
                    children: <RobboUnitStudentsTabContainer robboUnitId={robboUnitId} />,
                },
                {
                    label: <FormattedMessage id='robbo_unit.courses_item' />,
                    key: '5',
                    children: <RobboUnitCourses robboUnitId={robboUnitId} />,
                },
            ]}
        />
    )
}