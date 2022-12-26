import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Modal, Button } from "antd"
import { Navigate, useParams } from "react-router-dom"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
import AddStudentGroup from "@/components/AddStudentGroup"
import RobboGroup from "@/components/RobboGroup"
import ListItem from "@/components/ListItem"
import { useUserIdentity, checkAccess } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupsState } from "@/reducers/robboGroups"
import { DragResize } from "@/components/UI"
import {
    HOME_PAGE_ROUTE,
    LOGIN_PAGE_ROUTE,
    SUPER_ADMIN,
    UNIT_ADMIN,
} from "@/constants"
import {
    getRobboGroupsByRobboUnitIdRequest,
    deleteRobboGroupRequest,
    getAllRobboGroups,
    clearRobboGroupsPage,
} from '@/actions'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const token = localStorage.getItem('token')
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const actions = useActions({
        getRobboGroupsByRobboUnitIdRequest,
        deleteRobboGroupRequest,
        getAllRobboGroups,
        clearRobboGroupsPage,
    }, [])

    const { robboUnitId } = useParams()

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN]))
            if (robboUnitId)
                actions.getRobboGroupsByRobboUnitIdRequest(token, robboUnitId)
            else actions.getAllRobboGroups() // Только для Super Admin
        return () => {
            actions.clearRobboGroupsPage()
        }
    }, [loginLoading])

    const { robboGroups, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
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
                                    onClick={() => setOpenAddGroup(true)} type='primary'
                                >Создать группу
                                </Button>
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
                                                                                robboUnitId={robboGroup.robboUnitId}
                                                                                robboGroupId={robboGroup.id}
                                                                            />
                                                                        )}
                                                                    />
                                                                )}
                                                                handleDelete={
                                                                    robboGroupIndex =>
                                                                        actions.deleteRobboGroupRequest(
                                                                            token,
                                                                            robboUnitId,
                                                                            robboGroup.id,
                                                                            robboGroupIndex,
                                                                        )
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