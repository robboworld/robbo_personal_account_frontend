import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'

import { Title, Avatar, Description } from './components'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'
import Loader from '@/components/Loader'
import { getCoursePage, getCoursePageLoading } from '@/reducers/coursePage'
import { checkAccess, useUserIdentity, courseDescriptionParser } from '@/helpers'
import { useActions } from '@/helpers/useActions'
import {
    HOME_PAGE_ROUTE,
    LOGIN_PAGE_ROUTE,
    EDX_TEST_COURSES_ADDRESS,
    STUDENT,
    SUPER_ADMIN,
} from '@/constants'

export default () => {
    const { userRole, isAuth } = useUserIdentity()
    if (!checkAccess(userRole, [STUDENT, SUPER_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    const token = localStorage.getItem('token')
    const { coursePageId } = useParams()
    const { getCoursePageById, clearCoursePageState } = useActions()

    useEffect(() => {
        getCoursePageById(token, coursePageId)

        return () => {
            clearCoursePageState()
        }
    }, [clearCoursePageState, coursePageId, getCoursePageById, token])

    const loading = useSelector(state => getCoursePageLoading(state.coursePage))
    const coursePage = useSelector(state => getCoursePage(state.coursePage))

    const openCourseButtonHandler = () => {
        window.open(EDX_TEST_COURSES_ADDRESS + coursePage.course_id + '/about')
    }

    return (
        <PageLayout>
            <Card>
                {
                    loading
                        ? <Loader />
                        : (
                            <div>
                                <SideBar />
                                <Flex padding='2rem' direction='column'>
                                    <Title>{coursePage.name}</Title>
                                    <Flex direction='row'>
                                        <Flex direction='column' margin='0 1rem 0 0'
                                            style={{ maxWidth: '250px' }}>
                                            <Avatar src={coursePage.media.image.large} />
                                            <Button
                                                content='Открыть курс'
                                                background='darkgreen'
                                                margin='1rem 0 0 0' padding='0.5rem'
                                                handleSubmit={openCourseButtonHandler}
                                            />
                                            <Button
                                                content='Прогресс'
                                                background='darkgrey'
                                                margin='1rem 0 0 0' padding='0.5rem'
                                            />
                                            <Button
                                                content='Внешние источники'
                                                background='darkgrey'
                                                margin='1rem 0 0 0' padding='0.5rem'
                                            />
                                            <Button
                                                content='Связь с преподавателем'
                                                background='darkgrey'
                                                margin='1rem 0 0 0' padding='0.5rem'
                                            />
                                        </Flex>
                                        <Flex direction='column'>
                                            <Flex direction='column'>
                                                <h4>Описание курса</h4>
                                                <Description>
                                                    {courseDescriptionParser(coursePage)}
                                                </Description>

                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </div>
                        )

                }

            </Card>
        </PageLayout >
    )

}