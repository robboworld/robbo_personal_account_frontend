import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { WelcomeText } from "./components"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import { useActions } from "@/helpers/useActions"
import RobboUnitCard from "@/components/RobboUnitCard"
import Flex from '@/components/Flex'
import { getRobboUnitState } from "@/reducers/robboUnit"
import { Button } from "@/components/UI"
import Loader from "@/components/Loader"

export default () => {

    const token = localStorage.getItem('token')
    const history = useHistory()
    const { getRobboUnitById } = useActions()
    const { robboUnitId } = useParams()
    const { robboUnit, loading } = useSelector(({ robboUnit }) => getRobboUnitState(robboUnit))

    useEffect(() => {
        getRobboUnitById(token, robboUnitId)
        return () => {
            // clear robboUnit {}
        }
    }, [])

    return (
        <PageLayout>
            <Card>
                <SideBar />
                {
                    loading ? <Loader />
                        : (
                            <Flex direction='column'>
                                <WelcomeText>Robbo Unit</WelcomeText>
                                <RobboUnitCard robboUnit={robboUnit} />
                                <Flex>
                                    <Button
                                        content='Группы учеников'
                                        padding='1rem'
                                        background='green'
                                        handleSubmit={() => history.push(`/robboUnits/${robboUnit.id}/groups`)}
                                    />
                                </Flex>
                            </Flex>

                        )
                }
            </Card>
        </PageLayout>
    )
}