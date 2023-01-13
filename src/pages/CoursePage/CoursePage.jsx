import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import { Button, Row, Col, Modal } from 'antd'

import { Title, Avatar, Description } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from '@/components/Flex'
import Loader from '@/components/Loader'
import { getCoursePage, getCoursePageLoading } from '@/reducers/coursePage'
import { checkAccess, useUserIdentity, courseDescriptionParser } from '@/helpers'
import { useActions } from '@/helpers/useActions'
import { getCoursePageById, clearCoursePageState } from '@/actions'
import {
    HOME_PAGE_ROUTE,
    LOGIN_PAGE_ROUTE,
    EDX_TEST_COURSES_ADDRESS,
    STUDENT,
    SUPER_ADMIN,
} from '@/constants'
import CourseAccess from '@/components/CourseAccess'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()
    const [open, setOpen] = useState(false)

    const token = localStorage.getItem('token')
    const { coursePageId } = useParams()
    const actions = useActions({ getCoursePageById, clearCoursePageState }, [])

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [STUDENT, SUPER_ADMIN]))
            actions.getCoursePageById(token, coursePageId)
        return () => {
            actions.clearCoursePageState()
        }
    }, [loginLoading])

    const loading = useSelector(state => getCoursePageLoading(state.coursePage))
    const coursePage = useSelector(state => getCoursePage(state.coursePage))

    const openCourseButtonHandler = () => {
        window.open(EDX_TEST_COURSES_ADDRESS + coursePage.course_id + '/about')
    }

    if (!loginLoading && !checkAccess(userRole, [STUDENT, SUPER_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }


    return (
        <PageLayout>
            {
                loading || loginLoading
                    ? <Loader />
                    : (
                        <Flex padding='2rem' direction='column'>
                            <Title>{coursePage.name}</Title>
                            <Flex direction='row'>
                                <Flex direction='column' margin='0 1rem 0 0'
                                    style={{ maxWidth: '250px' }}>
                                    <Avatar src={coursePage?.media?.image?.large} />
                                    <Row gutter={[8, 8]}>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                                onClick={openCourseButtonHandler}
                                            >
                                                Открыть курс
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                                onClick={() => setOpen(true)}
                                            >
                                                Доступ
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                Прогресс
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                Внешние источники
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                Связь с преподавателем
                                            </Button>
                                        </Col>
                                    </Row>
                                </Flex>
                                <Flex direction='column'>
                                    <Flex direction='column'>
                                        <h4>Описание курса</h4>
                                        <Description>
                                            {courseDescriptionParser(coursePage)}
                                        </Description>

                                    </Flex>
                                </Flex>
                                <Modal
                                    title='Доступ к курсу'
                                    centered
                                    open={open}
                                    onOk={() => setOpen(true)}
                                    // confirmLoading={ }
                                    onCancel={() => setOpen(false)}
                                >
                                    <CourseAccess courseId={coursePage.id} />
                                </Modal>
                            </Flex>
                        </Flex >
                    )

            }
        </PageLayout >
    )

}