import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { WelcomeText } from './components'

import CoursePageItem from './MyCoursesItem'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Loader from '@/components/Loader'

import { getCoursePages, getCoursePagesLoading } from '@/reducers/myCourses'
import { useIsAuth } from '@/helpers/useIsAuth'


import Flex from '@/components/Flex'


import { useActions } from '@/helpers/useActions'

export default () => {
    const { getAllCoursePages, clearAllCoursePagesState } = useActions()
    useIsAuth()

    const token = localStorage.getItem('token')
    useEffect(() => {
        getAllCoursePages(token)
        return () => {
            clearAllCoursePagesState()
        }
    }, [])

    const coursePages = useSelector(state => getCoursePages(state.myCourses))
    const loading = useSelector(state => getCoursePagesLoading(state.myCourses))

    return (
        <PageLayout>
            <Card>
                <SideBar />
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
            </Card>
        </PageLayout>
    )
}