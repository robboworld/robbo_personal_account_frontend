import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Title, Avatar, Description } from './components'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Flex from '@/components/Flex'
import Button from '@/components/UI/Button'
import Loader from '@/components/Loader'
import { getIsAuth } from '@/reducers/login'
import { getCoursePage, getCoursePageLoading } from '@/reducers/coursePage'
import { useIsAuth } from '@/helpers/useIsAuth'
import { useActions } from '@/helpers/useActions'
import { courseDescriptionParser } from '@/helpers/courseDescriptionParser'

export default props => {
    const EDX_TEST_COURSES_ADDRESS = 'https://edx-test.ru/courses/'

    const { getCoursePageById, clearCoursePageState } = useActions()
    useIsAuth()
    const isAuth = useSelector(({ login }) => getIsAuth(login))
    if (!isAuth) {
        return <Redirect to='/login' />
    }
    const token = localStorage.getItem('token')
    // TO DO useParams
    const { coursePageId } = props.match.params

    useEffect(() => {
        getCoursePageById(token, coursePageId)

        return () => {
            clearCoursePageState()
        }
    }, [])

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