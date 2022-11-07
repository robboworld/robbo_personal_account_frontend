import React, { useEffect } from "react"

import { useSelector } from "react-redux"

import Loader from "../Loader"

import ListItem from "../ListItem"

import { ListRobboGroups, Text } from './components'

import Flex from '@/components/Flex'
import { useActions } from "@/helpers"

import { getRobboGroupsState } from "@/reducers/robboGroups"

export default ({ teacherId }) => {
    const { getRobboGroupsByAccessToken, getRobboGroupsByTeacherId } = useActions()
    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))
    useEffect(() => {
        if (teacherId) {
            getRobboGroupsByTeacherId(teacherId)
        } else {
            getRobboGroupsByAccessToken()
        }
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
                            robboGroups?.map((robboGroup, index) => {
                                return (
                                    <ListItem itemIndex={index}
                                        label={robboGroup.name}
                                        key={index}
                                        render={() => { }}
                                        handleDelete={false}
                                    />
                                )
                            })
                        )

                }
            </ListRobboGroups>
        </Flex>
    )
}