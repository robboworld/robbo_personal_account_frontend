import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { MainContainer, WelcomeText } from "./components"
import SideBar from "@/components/SideBar"

import { checkAuthRequest, clearAllCoursePagesState, getAllProjectPages } from '@/actions'
import { getIsAuth } from '@/reducers/login'
import { getCoursePages, getCoursePagesLoading } from "@/reducers/myCourses"
import { useIsAuth } from "@/helpers/useIsAuth"

import { getAllCoursePages } from "@/actions"
import CoursePageItem from "./MyCoursesItem"
import Flex from "@/components/Flex"
import Loader from "../../components/Loader"
import { useActions } from "@/helpers/useActions"

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
                <Flex direction="column" align="center">
                    <WelcomeText>Мои Курсы</WelcomeText>
                    {
                        loading ?
                            <Loader />
                            :
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