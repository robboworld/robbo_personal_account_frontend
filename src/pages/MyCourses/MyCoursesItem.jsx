import React from 'react'
import { useHistory } from 'react-router-dom'

import { CoursePageItem, Avatar, TitleLink, LittleDescription } from './components'

import Flex from '@/components/Flex'

export default ({ coursePage }) => {
    const history = useHistory()

    const toCoursePageHandler = () => {
        history.push(`/courses/${coursePage.id}`)
    }

    return (
        <CoursePageItem>
            <Flex>
                <Avatar src={coursePage.media.image.small} />
            </Flex>
            <Flex direction='column' margin='0 1rem'
                justify='space-between' width='100%'>
                <TitleLink onClick={toCoursePageHandler}> {coursePage.name}</TitleLink>
                <LittleDescription>{coursePage.short_description}</LittleDescription>
            </Flex>
        </CoursePageItem>
    )
}