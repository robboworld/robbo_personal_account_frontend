import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { WelcomeText } from './components'

import CoursePageItem from './MyCoursesItem'

import { PageLayout, Card } from '@/layouts'
import SideBar from '@/components/SideBar'
import Loader from '@/components/Loader'
import { getCoursePages, getCoursePagesLoading } from '@/reducers/myCourses'

import { useUserIdentity } from '@/helpers/useUserIdentity'
import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, STUDENT, SUPER_ADMIN } from '@/constants'
import { checkAccess } from '@/helpers'

export default () => {
    const { userRole, isAuth } = useUserIdentity()
    if (!checkAccess(userRole, [STUDENT, SUPER_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    const { getAllCoursePages, clearAllCoursePagesState } = useActions()
    const token = localStorage.getItem('token')
    useEffect(() => {
        getAllCoursePages(token)
        return () => {
            clearAllCoursePagesState()
        }
    }, [])

    const coursePages = useSelector(({ myCourses }) => getCoursePages(myCourses))
    const loading = useSelector(({ myCourses }) => getCoursePagesLoading(myCourses))

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