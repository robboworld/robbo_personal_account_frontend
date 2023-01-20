import React, { useState } from 'react'
import { Dropdown, Tabs, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'

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

const items = [
    {
        label: 'Текущий доступ',
        key: '0',
    },
    {
        label: 'Создать новый',
        key: '1',
    },
]

const CourseAccess = ({ courseId }) => {
    const [selectedKey, setSelectedKey] = useState('0')
    return (
        <Tabs
            defaultActiveKey='1'
            items={[
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
                                Robbo Units
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
                                Robbo Group
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
                                Unit Admins
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
                                Педагоги
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
                                Ученики
                                <DownOutlined />
                            </Space>
                        </Dropdown>,
                    key: '5',
                    children: selectedKey === '0'
                        ? <CurrentCourseAccessStudent courseId={courseId} />
                        : <StudentCourseAccess courseId={courseId} />,
                },
            ]}
        />
    )
}



export default CourseAccess