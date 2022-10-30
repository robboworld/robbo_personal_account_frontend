import React, { useEffect } from "react"

import { Text } from './components'

import Flex from '@/components/Flex'
import { useActions } from "@/helpers"

export default ({ teacherId }) => {
    const { getRobboGroupsByTeacherId } = useActions()
    const token = localStorage.getItem('token')
    useEffect(() => {
        // getRobboGroupsByTeacherId(token)
    }, [])


    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Назначенные группы</Text>
        </Flex>
    )
}