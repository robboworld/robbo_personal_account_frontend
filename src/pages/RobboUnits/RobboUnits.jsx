import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { Modal } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import RobboUnit from "@/components/RobboUnit"
import Loader from "@/components/Loader"
import ListItem from "@/components/ListItem"
import AddRobboUnit from "@/components/AddRobboUnit"
import { useActions } from "@/helpers/useActions"
import { getRobboUnitsState } from "@/reducers/robboUnits"
import { Button, DragResize } from "@/components/UI"
import { useUserIdentity, checkAccess } from "@/helpers"
import {
    HOME_PAGE_ROUTE,
    SUPER_ADMIN,
    UNIT_ADMIN,
    LOGIN_PAGE_ROUTE,
} from "@/constants"
import {
    getRobboUnits,
    getRobboUnitsByUnitAdminIdRequest,
    deleteRobboUnitRequest,
    clearRobboUnitsPage,
} from '@/actions'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const history = useNavigate()
    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)
    const token = localStorage.getItem('token')
    const actions = useActions({ getRobboUnits, getRobboUnitsByUnitAdminIdRequest, deleteRobboUnitRequest, clearRobboUnitsPage }, [])
    const { robboUnits, loading } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN]))
            switch (userRole) {
                case UNIT_ADMIN:
                    actions.getRobboUnitsByUnitAdminIdRequest(token)
                    break
                case SUPER_ADMIN:
                    actions.getRobboUnits(token)
                    break
            }

        return () => actions.clearRobboUnitsPage()
    }, [loginLoading])

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])) {
        return <Navigate to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Navigate to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            <WelcomeText>Robbo Units</WelcomeText>
            <Modal
                centered
                open={openAddRobboUnit}
                onCancel={() => setOpenAddRobboUnit(false)}
                footer={[]}
            >
                <AddRobboUnit />
            </Modal>
            <Flex direction='column' justify='flex-end'
                align='flex-start'>
                <Button
                    background='green'
                    content='Программа'
                    padding='0.5rem'
                    margin='0.5rem'
                    handleSubmit={() => history('/program')}
                />
                <Button
                    background='green'
                    content='Добавить Robbo Unit'
                    padding='0.5rem'
                    margin='0.5rem'
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
                            {/* TODO refactor list from antd */}
                            <Flex direction='column'>
                                {
                                    robboUnits?.map((robboUnit, index) => {
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                key={index}
                                                label={robboUnit.name}
                                                render={(open, setOpen) => (
                                                    <DragResize
                                                        open={open} setOpen={setOpen}
                                                        content={() => (
                                                            <RobboUnit
                                                                robboUnitId={robboUnit.id}
                                                            />
                                                        )}
                                                    />
                                                )}
                                                handleDelete={robboUnitIndex => actions.deleteRobboUnitRequest(token, robboUnit.id, robboUnitIndex)}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    )
            }
        </PageLayout>
    )
}