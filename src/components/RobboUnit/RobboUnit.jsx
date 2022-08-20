import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

import { Title } from "./components"

import { useActions } from "@/helpers/useActions"
import RobboUnitCard from "@/components/RobboUnitCard"
import Flex from '@/components/Flex'
import { getRobboUnitState } from "@/reducers/robboUnit"
import { Button } from "@/components/UI"
import Loader from "@/components/Loader"

export default ({ robboUnitId }) => {

    const token = localStorage.getItem('token')
    const history = useHistory()
    const { getRobboUnitById } = useActions()
    const { robboUnit, loading } = useSelector(({ robboUnit }) => getRobboUnitState(robboUnit))

    useEffect(() => {
        getRobboUnitById(token, robboUnitId)
        return () => {
            // clear robboUnit {}
        }
    }, [])

    return (
        <Flex width='100%'>
            {
                loading ? <Loader />
                    : (
                        <Flex
                            direction='column' width='100%'
                            padding='0.5rem'
                        >
                            <Flex justify='center' width='100%'>
                                <Title>Robbo Unit</Title>
                            </Flex>

                            <RobboUnitCard robboUnit={robboUnit} />
                            <Flex direction='column' align='flex-start'>
                                <Button
                                    content='Группы учеников'
                                    padding='1rem'
                                    background='green'
                                    margin='0.5rem'
                                    handleSubmit={() => history.push(`/robboUnits/${robboUnit.id}/groups`)}
                                />
                                <Button
                                    content='Настроить доступ'
                                    padding='1rem'
                                    background='green'
                                    margin='0.5rem'
                                // handleSubmit={() => history.push(`/robboUnits/${robboUnit.id}/groups`)}
                                />
                            </Flex>
                        </Flex>

                    )
            }
        </Flex >
    )
}