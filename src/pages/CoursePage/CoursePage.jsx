import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Row, Col, Modal, Typography, Avatar } from 'antd'

import PageLayout from '@/components/PageLayout'
import Loader from '@/components/Loader'
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

const { Title } = Typography

export default ({ userRole }) => {
    const [open, setOpen] = useState(false)

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

    return (
        <PageLayout>
            {
                loading
                    ? <Loader />
                    : (
                        <React.Fragment>
                            <Row align='middle'>
                                <Col span={22}>
                                    <Title>{coursePage.name}</Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>
                                    <Row gutter={[0, 8]}>
                                        <Avatar shape='square' size={128}
                                            src={coursePage?.media?.image?.large}
                                        />
                                    </Row>
                                    <Row>
                                        <Button
                                            type='primary' size='large'
                                            onClick={openCourseButtonHandler}
                                        >
                                            Открыть курс
                                        </Button>
                                    </Row>
                                    <Row>
                                        <Button
                                            type='primary' size='large'
                                        >
                                            Прогресс
                                        </Button>
                                    </Row>
                                    <Row>
                                        {
                                            checkAccess(userRole, [UNIT_ADMIN, SUPER_ADMIN, TEACHER]) &&
                                            <Button
                                                type='primary' size='large'
                                                onClick={() => setOpen(true)}
                                            >
                                                Доступ
                                            </Button>
                                        }
                                    </Row>
                                    <Row>
                                        <Button
                                            type='primary' size='large'
                                        >
                                            Внешние источники
                                        </Button>
                                    </Row>
                                    <Row>
                                        <Button
                                            type='primary' size='large'
                                        >
                                            Связь с преподавателем
                                        </Button>
                                    </Row>
                                </Col>
                                <Col span={20}>
                                    <Row>
                                        <Title level={3}>
                                            Описание курса
                                        </Title>
                                    </Row>
                                    <Row>
                                        <Title level={5}>
                                            {courseDescriptionParser(coursePage)}
                                        </Title>
                                    </Row>
                                </Col>
                            </Row>
                            <Modal
                                title='Доступ к курсу' centered
                                open={open} onOk={() => setOpen(true)}
                                // confirmLoading={ }
                                onCancel={() => setOpen(false)}
                                width='50%'
                            >
                                <CourseAccess courseId={coursePage.id} userRole={userRole} />
                            </Modal>
                        </React.Fragment>
                    )

            }
        </PageLayout >
    )

}