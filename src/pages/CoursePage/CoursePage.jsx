import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { Title, Avatar, Description } from "./components"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import { getCoursePage, getCoursePageLoading } from "@/reducers/coursePage"
import { getCoursePageById, clearCoursePageState } from "@/actions"
import { getIsAuth } from '@/reducers/login'
import { useIsAuth } from "@/helpers/useIsAuth"
import Loader from "../../components/Loader"

export default props => {
    const dispatch = useDispatch()
    useIsAuth()

    const token = localStorage.getItem('token')
    const { coursePageId } = props.match.params

    useEffect(() => {
        dispatch(getCoursePageById(token, coursePageId))

        return () => {
            dispatch(clearCoursePageState())
        }
    }, [])


    const loading = useSelector(state => getCoursePageLoading(state.coursePage))
    const coursePage = useSelector(state => getCoursePage(state.coursePage))

    return (
        <PageLayout>
            <Card>
                {
                    loading ?
                        <Loader />
                        :
                        (<div>
                            <SideBar />
                            <Flex padding="2rem" direction="column">
                                <Title>{coursePage.name}</Title>
                                <Flex direction="row">
                                    <Flex direction="column" margin="0 1rem 0 0" style={{ maxWidth: '250px' }}>
                                        <Avatar src={coursePage.media.image.large} />
                                        <Button
                                            content="Открыть курс"
                                            background="darkgreen"
                                            margin="1rem 0 0 0" padding="0.5rem"
                                        />
                                        <Button
                                            content="Прогресс"
                                            background="darkgrey"
                                            margin="1rem 0 0 0" padding="0.5rem"
                                        />
                                        <Button
                                            content="Внешние источники"
                                            background="darkgrey"
                                            margin="1rem 0 0 0" padding="0.5rem"
                                        />
                                        <Button
                                            content="Связь с преподавателем"
                                            background="darkgrey"
                                            margin="1rem 0 0 0" padding="0.5rem"
                                        />
                                    </Flex>
                                    <Flex direction="column">
                                        <Flex direction="column">
                                            <h4>Описание курса</h4>
                                            <Description>
                                                {coursePage.short_description}
                                            </Description>

                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </div>)

                }

            </Card>
        </PageLayout >
    )

}