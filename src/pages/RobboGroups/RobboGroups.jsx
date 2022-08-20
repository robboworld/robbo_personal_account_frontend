import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { WelcomeText } from "../UnitAdmins/components"

import { PageLayout, Card } from "@/layouts"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { ModalWindow, Button } from "@/components/UI"
import Loader from "@/components/Loader"
import AddStudentGroup from "@/components/AddStudentGroup"
import ListItem from "@/components/ListItem"
import { useIsAuth } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboUnitState } from "@/reducers/robboUnit"


export default () => {
    useIsAuth()
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const {
        getRobboGroupsByRobboUnitIdRequest,
        deleteRobboGroupRequest,
    } = useActions()
    const history = useHistory()
    const { robboUnitId } = useParams()
    const { robboUnit, loading } = useSelector(({ robboUnit }) => getRobboUnitState(robboUnit))


    useEffect(() => {
        getRobboGroupsByRobboUnitIdRequest(robboUnitId)
        return () => {
            // clear
        }
    }, [])

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Группы</WelcomeText>
                <ModalWindow
                    open={openAddGroup} setOpen={setOpenAddGroup}
                    width='35%' height='60%'
                    content={() => (
                        <AddStudentGroup />
                    )}
                />
                <Flex direction='row' justify='flex-end'
                    align='flex-start'>
                    <Button
                        background='green'
                        content='Создать группу'
                        padding='0.5rem'
                        handleSubmit={() => setOpenAddGroup(true)}
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
                                        robboUnit.robboGroups?.map((robboGroup, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    key={index}
                                                    label={robboGroup.id}
                                                    render={() => { }}
                                                    handleClick={() => history.push(`/robboUnits/${robboUnit.id}/groups/${robboGroup.id}`)}
                                                    handleDelete={robboGroupIndex => deleteRobboGroupRequest(robboUnit.id, robboGroup.id, robboGroupIndex)}
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