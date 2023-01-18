import React from 'react'
import { Tabs } from 'antd'

import StudentCourseAccess from './StudentCourseAccess'
import UnitAdminCourseAccess from './UnitAdminCourseAccess'
import TeacherCourseAccess from './TeacherCourseAccess'
import RobboUnitCourseAccess from './RobboUnitCourseAccess'
import RobboGroupCourseAccess from './RobboGroupCourseAccess'

const CourseAccess = ({ courseId }) => {
    return (
        <Tabs
            defaultActiveKey='1'
            items={[
                {
                    label: 'Robbo Unit',
                    key: '1',
                    children: <RobboUnitCourseAccess courseId={courseId} />,
                },
                {
                    label: 'Robbo Group',
                    key: '2',
                    children: <RobboGroupCourseAccess courseId={courseId} />,
                },
                {
                    label: 'Unit Admin',
                    key: '3',
                    children: <UnitAdminCourseAccess courseId={courseId} />,
                },
                {
                    label: 'Педагоги',
                    key: '4',
                    children: <TeacherCourseAccess courseId={courseId} />,
                },
                {
                    label: 'Ученики',
                    key: '5',
                    children: <StudentCourseAccess courseId={courseId} />,
                },
            ]}
        />
    )
}



export default CourseAccess