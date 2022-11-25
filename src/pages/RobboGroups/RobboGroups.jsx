import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Modal } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import { DragResize, Button } from "@/components/UI"
import Loader from "@/components/Loader"
import AddStudentGroup from "@/components/AddStudentGroup"
import RobboGroup from "@/components/RobboGroup"
import ListItem from "@/components/ListItem"
import { useUserIdentity, checkAccess } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupsState } from "@/reducers/robboGroups"
import { HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE, SUPER_ADMIN, UNIT_ADMIN } from "@/constants"

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const token = localStorage.getItem('token')
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const {
        getRobboGroupsByRobboUnitIdRequest,
        deleteRobboGroupRequest,
    } = useActions()

    const { robboUnitId } = useParams()

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN]))
            getRobboGroupsByRobboUnitIdRequest(token, robboUnitId)
        return () => {
            // clear
        }
    }, [loginLoading])

    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            {
                loginLoading ? <Loader />
                    : (
                        <div>
                            <WelcomeText>Группы</WelcomeText>
                            <Modal
                                centered
                                open={openAddGroup}
                                onCancel={() => setOpenAddGroup(false)}
                                footer={[]}
                            >
                                <AddStudentGroup robboUnitId={robboUnitId} />
                            </Modal>
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
                                            {/* TODO refactor list from antd */}
                                            <Flex direction='column'>
                                                {
                                                    robboGroups?.map((robboGroup, index) => {
                                                        return (
                                                            <ListItem
                                                                itemIndex={index}
                                                                key={index}
                                                                label={robboGroup.name}
                                                                render={(open, setOpen) => (
                                                                    <DragResize
                                                                        open={open} setOpen={setOpen}
                                                                        content={() => (
                                                                            // refactor in robboGroup useQuery
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
                        </div>
                    )
            }
        </PageLayout>
    )
}