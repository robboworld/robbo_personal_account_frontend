import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import { useSelector } from "react-redux"



import { WelcomeText } from "./components"

import { PageLayout, Card } from "@/layouts"
import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import { ModalWindow, Button } from "@/components/UI"
import Loader from "@/components/Loader"
import AddStudentGroup from "@/components/AddStudentGroup"
import RobboGroup from "@/components/RobboGroup"
import ListItem from "@/components/ListItem"
import { useIsAuth } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupsState } from "@/reducers/robboGroups"
import { getLoginState } from "@/reducers/login"



export default () => {
    useIsAuth()
    const token = localStorage.getItem('token')
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const {
        getRobboGroupsByRobboUnitIdRequest,
        deleteRobboGroupRequest,
    } = useActions()

    const { robboUnitId } = useParams()
    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))
    const { userRole } = useSelector(({ login }) => getLoginState(login))

    if (userRole !== 5 || userRole !== 4) {
        return <Redirect to='/home' />
    }

    useEffect(() => {
        getRobboGroupsByRobboUnitIdRequest(token, robboUnitId)
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
                        <AddStudentGroup robboUnitId={robboUnitId} />
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
                                        robboGroups?.map((robboGroup, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    key={index}
                                                    label={robboGroup.name}
                                                    render={(open, setOpen) => (
                                                        <ModalWindow
                                                            open={open} setOpen={setOpen}
                                                            width='65%' height='80%'
                                                            content={() => (
                                                                <RobboGroup
                                                                    robboUnitId={robboUnitId}
                                                                    robboGroupId={robboGroup.id}
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                    // handleClick={() => history.push(`/robboUnits/${robboUnit.id}/groups/${robboGroup.id}`)}
                                                    handleDelete={robboGroupIndex =>
                                                        deleteRobboGroupRequest(token, robboUnitId, robboGroup.id, robboGroupIndex)
                                                    }
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