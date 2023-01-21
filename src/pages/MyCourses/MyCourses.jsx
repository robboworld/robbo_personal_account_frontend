import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { WelcomeText } from './components'
import CoursePageItem from './MyCoursesItem'

import PageLayout from '@/components/PageLayout'
import Loader from '@/components/Loader'
import { getCoursePages, getCoursePagesLoading } from '@/reducers/myCourses'

import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { getAllCoursePages, getCoursePagesByUserRequest, clearAllCoursePagesState } from '@/actions'

export default () => {
    const actions = useActions({ getAllCoursePages, getCoursePagesByUserRequest, clearAllCoursePagesState })
    useEffect(() => {
        actions.getCoursePagesByUserRequest()
        return () => {
            actions.clearAllCoursePagesState()
        }
    }, [])

    const coursePages = useSelector(({ myCourses }) => getCoursePages(myCourses))
    const loading = useSelector(({ myCourses }) => getCoursePagesLoading(myCourses))

    return (
        <PageLayout>

            <Flex direction='column' align='center'>
                <WelcomeText>Мои Курсы</WelcomeText>
                {
                    loading
                        ? <Loader />
                        : coursePages?.map((coursePage, index) => {
                            return (
                                <CoursePageItem
                                    coursePage={coursePage}
                                    key={index}
                                />
                            )
                        })
                }
            </Flex>
        </PageLayout>
    )
}