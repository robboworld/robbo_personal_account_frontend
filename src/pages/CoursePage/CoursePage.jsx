import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Modal, Typography, Avatar, Spin } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { getCoursePage, getCoursePageLoading } from '@/reducers/coursePage'
import { checkAccess, courseDescriptionParser } from '@/helpers'
import { useActions } from '@/helpers/useActions'
import { getCoursePageById, clearCoursePageState } from '@/actions'
import {
    EDX_TEST_COURSES_ADDRESS,
    SUPER_ADMIN,
    UNIT_ADMIN,
    TEACHER,
} from '@/constants'
import CourseAccess from '@/components/CourseAccess'
import {
    CourseAside,
    CourseBody,
    CourseLayout,
    PageContent,
    PageToolbar,
} from '@/components/AccountShell'

const { Title } = Typography

export default ({ userRole }) => {
    const [open, setOpen] = useState(false)
    const intl = useIntl()
    const token = localStorage.getItem('token')
    const { coursePageId } = useParams()
    const actions = useActions({ getCoursePageById, clearCoursePageState }, [])

    useEffect(() => {
        actions.getCoursePageById(token, coursePageId)
        return () => {
            actions.clearCoursePageState()
        }
    }, [])

    const loading = useSelector(state => getCoursePageLoading(state.coursePage))
    const coursePage = useSelector(state => getCoursePage(state.coursePage))

    const openCourseButtonHandler = () => {
        window.open(EDX_TEST_COURSES_ADDRESS + coursePage.course_id + '/about')
    }

    if (loading) {
        return (
            <PageContent>
                <Spin />
            </PageContent>
        )
    }

    return (
        <PageContent>
            <PageToolbar>
                <Title level={2} style={{ margin: 0 }}>
                    {coursePage.name}
                </Title>
            </PageToolbar>
            <CourseLayout>
                <CourseAside>
                    <Avatar
                        shape='square'
                        size={128}
                        src={coursePage?.media?.image?.large}
                    />
                    <Button
                        type='primary'
                        size='large'
                        onClick={openCourseButtonHandler}
                    >
                        <FormattedMessage id='course_page.open_course' />
                    </Button>
                    <Button type='primary' size='large'>
                        <FormattedMessage id='course_page.progress' />
                    </Button>
                    {checkAccess(userRole, [UNIT_ADMIN, SUPER_ADMIN, TEACHER]) && (
                        <Button
                            type='primary'
                            size='large'
                            onClick={() => setOpen(true)}
                        >
                            <FormattedMessage id='course_page.access' />
                        </Button>
                    )}
                    <Button type='primary' size='large'>
                        <FormattedMessage id='course_page.external_sources' />
                    </Button>
                    <Button type='primary' size='large'>
                        <FormattedMessage id='course_page.communication_with_the_teacher' />
                    </Button>
                </CourseAside>
                <CourseBody>
                    <Title level={3}>
                        <FormattedMessage id='robbo_group_card.course_description' />
                    </Title>
                    <Title level={5}>
                        {courseDescriptionParser(coursePage)}
                    </Title>
                </CourseBody>
            </CourseLayout>
            <Modal
                title={intl.formatMessage({ id: 'course_page.course_access' })}
                centered
                open={open}
                onOk={() => setOpen(true)}
                onCancel={() => setOpen(false)}
                width='min(520px, calc(100vw - 2rem))'
            >
                <CourseAccess courseId={coursePage.id} userRole={userRole} />
            </Modal>
        </PageContent>
    )
}
