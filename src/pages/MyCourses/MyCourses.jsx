import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { WelcomeText } from './components'

import CoursePageItem from './MyCoursesItem'

import PageLayout from '@/components/PageLayout'
import Loader from '@/components/Loader'
import { getCoursePages, getCoursePagesLoading } from '@/reducers/myCourses'

import { useUserIdentity } from '@/helpers/useUserIdentity'
import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, STUDENT, SUPER_ADMIN } from '@/constants'
import { checkAccess } from '@/helpers'
import { getAllCoursePages, getCoursePagesByUserRequest, clearAllCoursePagesState } from '@/actions'
export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const actions = useActions({ getAllCoursePages, getCoursePagesByUserRequest, clearAllCoursePagesState })
    const token = localStorage.getItem('token')
    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [STUDENT, SUPER_ADMIN]))
            actions.getCoursePagesByUserRequest()
        return () => {
            actions.clearAllCoursePagesState()
        }
    }, [loginLoading])

    const coursePages = useSelector(({ myCourses }) => getCoursePages(myCourses))
    const loading = useSelector(({ myCourses }) => getCoursePagesLoading(myCourses))

    if (!loginLoading && !checkAccess(userRole, [STUDENT, SUPER_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            {
                loginLoading ? <Loader />
                    : (
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
                    )
            }
        </PageLayout>
    )
}