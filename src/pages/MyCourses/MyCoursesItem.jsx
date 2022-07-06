import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"

import { CoursePageItem, Avatar, TitleLink, LittleDescription } from './components'

export default ({ coursePage }) => {

    const dispatсh = useDispatch()
    const history = useHistory()
    const token = localStorage.getItem('token')

    const toCoursePageHandler = () => {
        history.push(`/courses/${coursePage.id}`)
    }


    return (
        <CoursePageItem>
            <Flex>
                <Avatar />
            </Flex>
            <Flex direction="column" margin="0 1rem"
                justify="space-between" width="100%">
                <TitleLink onClick={toCoursePageHandler}> {coursePage.title}</TitleLink>
                <LittleDescription>{coursePage.description}</LittleDescription>
            </Flex>
        </CoursePageItem>
    )
}