import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dropdown, Tabs, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { PropTypes } from 'prop-types'

import StudentCourseAccess from './StudentCourseAccess'
import UnitAdminCourseAccess from './UnitAdminCourseAccess'
import TeacherCourseAccess from './TeacherCourseAccess'
import RobboUnitCourseAccess from './RobboUnitCourseAccess'
import RobboGroupCourseAccess from './RobboGroupCourseAccess'
import CurrentCourseAccessStudent from './CurrentAccessStudents'
import CurrentCourseAccessRobboGroups from './CurrentAccessRobboGroups'
import CurrentCourseAccessRobboUnits from './CurrentAccessRobboUnits'
import CurrentCourseAccessUnitAdmins from './CurrentAccessUnitAdmins'
import CurrentCourseAccessTeachers from './CurrentAccessTeachers'

import { TEACHER, UNIT_ADMIN } from '@/constants'

const items = [
    {
        label: <FormattedMessage id='course_access.items_current_access' />,
        key: '0',
    },
    {
        label: <FormattedMessage id='course_access.items_create_new' />,
        key: '1',
    },
]

const CourseAccess = ({ courseId, userRole }) => {
    const [selectedKey, setSelectedKey] = useState('0')
    let defaultActiveKey = '1'
    let tabsItems = [
        {
            label:
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['0'],
                        selectedKeys: [selectedKey],
                        onSelect: ({ key }) => setSelectedKey(key),
                    }}
                >
                    <Space>
                        <FormattedMessage id='course_access.tabs_items_robbo_units' />
                        <DownOutlined />
                    </Space>
                </Dropdown>,
            key: '1',
            children: selectedKey === '0'
                ? <CurrentCourseAccessRobboUnits courseId={courseId} />
                : <RobboUnitCourseAccess courseId={courseId} />,
        },
        {
            label:
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['0'],
                        selectedKeys: [selectedKey],
                        onSelect: ({ item, key }) => setSelectedKey(key),
                    }}
                >
                    <Space>
                        <FormattedMessage id='course_access.tabs_items_robbo_groups' />
                        <DownOutlined />
                    </Space>
                </Dropdown>,
            key: '2',
            children: selectedKey === '0'
                ? <CurrentCourseAccessRobboGroups courseId={courseId} />
                : <RobboGroupCourseAccess courseId={courseId} />,
        },
        {
            label:
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['0'],
                        selectedKeys: [selectedKey],
                        onSelect: ({ item, key }) => setSelectedKey(key),
                    }}
                >
                    <Space>
                        <FormattedMessage id='course_access.tabs_items_unit_admins' />
                        <DownOutlined />
                    </Space>
                </Dropdown>,
            key: '3',
            children: selectedKey === '0'
                ? <CurrentCourseAccessUnitAdmins courseId={courseId} />
                : <UnitAdminCourseAccess courseId={courseId} />,
        },
        {
            label:
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['0'],
                        selectedKeys: [selectedKey],
                        onSelect: ({ item, key }) => setSelectedKey(key),
                    }}
                >
                    <Space>
                        <FormattedMessage id='course_access.tabs_items_teachers' />
                        <DownOutlined />
                    </Space>
                </Dropdown>,
            key: '4',
            children: selectedKey === '0'
                ? <CurrentCourseAccessTeachers courseId={courseId} />
                : <TeacherCourseAccess courseId={courseId} />,
        },
        {
            label:
                <Dropdown
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['0'],
                        selectedKeys: [selectedKey],
                        onSelect: ({ item, key }) => setSelectedKey(key),
                    }}
                >
                    <Space>
                        <FormattedMessage id='course_access.tabs_items_students' />
                        <DownOutlined />
                    </Space>
                </Dropdown>,
            key: '5',
            children: selectedKey === '0'
                ? <CurrentCourseAccessStudent courseId={courseId} />
                : <StudentCourseAccess courseId={courseId} />,
        },
    ]

    // it is necessary to restrict access to some tabs depending on the role 
    switch (userRole) {
        case UNIT_ADMIN:
            tabsItems = tabsItems.filter(tabItem => ['2', '4', '5'].includes(tabItem.key, 0))
            defaultActiveKey = '2'
            break
        case TEACHER:
            tabsItems = tabsItems.filter(tabItem => ['5'].includes(tabItem.key, 0))
            defaultActiveKey = '5'
            break
    }

    return (
        <Tabs
            defaultActiveKey={defaultActiveKey}
            items={tabsItems}
        />
    )
}

CourseAccess.propTypes = {
    courseId: PropTypes.string.isRequired,
    userRole: PropTypes.number.isRequired,
}


export default CourseAccess