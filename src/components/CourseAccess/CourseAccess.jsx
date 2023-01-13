import React from 'react'
import { Tabs } from 'antd'

import StudentCourseAccess from './StudentCourseAccess'

const CourseAccess = ({ courseId }) => {
    return (
        <Tabs
            defaultActiveKey='1'
            items={[
                {
                    label: 'Robbo Unit',
                    key: '1',
                    children: 'Robbo Unit',
                },
                {
                    label: 'Robbo Group',
                    key: '2',
                    children: 'Robbo Group',
                },
                {
                    label: 'Педагоги',
                    key: '3',
                    children: 'Педагоги',
                },
                {
                    label: 'Ученики',
                    key: '4',
                    children: <StudentCourseAccess courseId={courseId} />,
                },
            ]}
        />
    )
}



export default CourseAccess