import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { WelcomeText } from "./components"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { Button, ModalWindow } from "@/components/UI"
import AddRobboUnit from "@/components/AddRobboUnit"
import { useActions } from "@/helpers/useActions"
import { getRobboUnitsState } from "@/reducers/robboUnits"
import Loader from "@/components/Loader"
import ListItem from "@/components/ListItem"

export default () => {

    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)
    const token = localStorage.getItem('token')
    const { getRobboUnits, deleteRobboUnitRequest } = useActions()
    const { robboUnits, loading } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        getRobboUnits(token)
        return () => {
            // clear
        }
    }, [])

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Robbo Units</WelcomeText>
                <ModalWindow
                    open={openAddRobboUnit} setOpen={setOpenAddRobboUnit}
                    width='35%'
                    content={() => (
                        <AddRobboUnit />
                    )}
                />
                <Flex direction='row' justify='flex-end'
                    align='flex-start'>
                    <Button
                        background='green'
                        content='Добавить Robbo Unit'
                        padding='0.5rem'
                        handleSubmit={() => setOpenAddRobboUnit(true)}
                    />
                </Flex>
                {
                    loading ? <Loader />
                        : (
                            <Flex
                                widht='100%' direction='column'
                                justify=' center'
                            >
                                <Flex direction='column'>
                                    {
                                        robboUnits?.map((robboUnit, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    key={index}
                                                    label={robboUnit.name}
                                                    render={() => { }}
                                                    handleDelete={robboUnitIndex => deleteRobboUnitRequest(token, robboUnit.id, robboUnitIndex)}
                                                />
                                            )
                                        })
                                    }
                                </Flex>
                            </Flex>
                        )
                }
            </Card>
        </PageLayout>
    )
}