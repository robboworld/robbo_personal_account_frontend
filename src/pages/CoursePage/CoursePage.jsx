import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import { PageLayout, Card } from "@/layouts"
import { Title, Avatar, Description } from "./components"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import { getCoursePage } from "@/reducers/coursePage"

export default props => {
    const dispath = useDispatch()
    // const token = localStorage.getItem('token')

    const coursePage = useSelector(state => getCoursePage(state.coursePage))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex padding="2rem" direction="column">
                    <Title>{coursePage.title}</Title>
                    <Flex direction="row">
                        <Flex direction="column" margin="0 1rem 0 0">
                            <Avatar />
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
                                    {coursePage.description}
                                </Description>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Card>
        </PageLayout>
    )

}