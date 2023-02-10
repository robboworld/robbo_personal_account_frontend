import React from "react"
import { Tabs } from "antd"
import { PropTypes } from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import RobboGroupCard from "./RobboGroupCard"
import RobboGroupCourses from "./RobboGroupCourses"
import RobboGroupTeachersTab from "./RobboGroupTeachersTab"
import RobboStudentsTabContainer from "./RobboGroupStudentsTabContainer"

const RobboGroup = ({
    robboUnitId,
    robboGroupId,
    disableСhanges,
}) => {
    const intl = useIntl()
    return (
        <Tabs
            title={intl.formatMessage({ id: 'robbo_group.card_title' })}
            defaultActiveKey='1'
            items={[
                {
                    label: <FormattedMessage id='robbo_group.card_item' />,
                    key: '1',
                    children:
                        <RobboGroupCard
                            robboGroupId={robboGroupId} disableСhanges={disableСhanges}
                        />,
                },
                {
                    label: <FormattedMessage id='robbo_group.students_item' />,
                    key: '2',
                    children:
                        <RobboStudentsTabContainer
                            robboGroupId={robboGroupId}
                            robboUnitId={robboUnitId}
                            disableСhanges={disableСhanges}
                        />,
                },
                {
                    label: <FormattedMessage id='robbo_group.teachers_item' />,
                    key: '3',
                    children: <RobboGroupTeachersTab robboGroupId={robboGroupId} />,
                },
                {
                    label: <FormattedMessage id='robbo_group.courses_item' />,
                    key: '4',
                    children: <RobboGroupCourses robboGroupId={robboGroupId} />,
                },
            ]}
        />
    )
}

RobboGroup.propTypes = {
    robboUnitId: PropTypes.string,
    robboGroupId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboGroup