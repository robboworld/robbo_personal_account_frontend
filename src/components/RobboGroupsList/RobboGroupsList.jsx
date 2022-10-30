import React, { useEffect } from "react"

import { useSelector } from "react-redux"

import Loader from "../Loader"

import ListItem from "../ListItem"

import { ListRobboGroups, Text } from './components'

import Flex from '@/components/Flex'
import { useActions } from "@/helpers"

import { getTeachersState } from "@/reducers/teachers"

export default ({ teacherId }) => {
    const { getRobboGroupsByTeacherId } = useActions()
    const { teacherRobboGroups, loading } = useSelector(({ teachers }) => getTeachersState(teachers))
    useEffect(() => {
        getRobboGroupsByTeacherId()
    }, [])


    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Назначенные группы</Text>
            <ListRobboGroups>
                {
                    loading ? <Loader />
                        : (
                            teacherRobboGroups?.map((robboGroup, index) => {
                                return (
                                    <ListItem itemIndex={index}
                                        label={robboGroup.name}
                                        key={index}
                                        render={() => { }}
                                    />
                                )
                            })
                        )

                }
            </ListRobboGroups>
        </Flex>
    )
}