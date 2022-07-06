import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { MainContainer, WelcomeText } from "./components"
import SideBar from "@/components/SideBar"

import { checkAuthRequest, getAllProjectPages } from '@/actions'
import { getIsAuth } from '@/reducers/login'
import { getCoursePages } from "@/reducers/myCourses"
import { useIsAuth } from "@/helpers/useIsAuth"

import { getAllCoursePages } from "@/actions"
import CoursePageItem from "./MyCoursesItem"
import Flex from "@/components/Flex"

export default () => {
    const dispatch = useDispatch()
    useIsAuth()

    const token = localStorage.getItem('token')
    useEffect(() => {
        dispatch(getAllCoursePages(token))
    }, [])

    const coursePages = useSelector(state => getCoursePages(state.myCourses))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex direction="column" align="center">
                    <WelcomeText>Мои Курсы</WelcomeText>
                    {
                        coursePages?.map((coursePage, index) => {
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