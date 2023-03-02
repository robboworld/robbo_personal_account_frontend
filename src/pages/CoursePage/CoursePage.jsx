import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Button, Row, Col, Typography, Avatar, Spin } from 'antd'
import { FormattedMessage } from 'react-intl'

import PageLayout from '@/components/PageLayout'
import { getCoursePage, getCoursePageLoading } from '@/reducers/coursePage'
import { courseDescriptionParser } from '@/helpers'
import { useActions } from '@/helpers/useActions'
import { getCoursePageById, clearCoursePageState } from '@/actions'
import {
    EDX_TEST_COURSES_ADDRESS,
} from '@/constants'

const { Title } = Typography

export default ({ userRole }) => {
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
                    ? <Spin />
                    : (
                        <React.Fragment>
                            <Row align='middle'>
                                <Col span={22}>
                                    <Title>{coursePage.name}</Title>
                                </Col>
                            </Row>
                            <Row gutter={[8, 8]}>
                                <Col span={4}>
                                    <Row gutter={[0, 16]}>
                                        <Col span={24}>
                                            <Avatar shape='square' size={128}
                                                src={coursePage?.media?.image?.large}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                                onClick={openCourseButtonHandler}
                                            >
                                                <FormattedMessage id='course_page.open_course' />
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                <FormattedMessage id='course_page.progress' />
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                <FormattedMessage id='course_page.external_sources' />
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <Button
                                                type='primary' size='large'
                                            >
                                                <FormattedMessage id='course_page.communication_with_the_teacher' />
                                            </Button>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col span={20}>
                                    <Row>
                                        <Title level={3}>
                                            <FormattedMessage id='course_page.course_description' />
                                        </Title>
                                    </Row>
                                    <Row>
                                        <Title level={5}>
                                            {courseDescriptionParser(coursePage)}
                                        </Title>
                                    </Row>
                                </Col>
                            </Row>
                        </React.Fragment>
                    )

            }
        </PageLayout >
    )

}