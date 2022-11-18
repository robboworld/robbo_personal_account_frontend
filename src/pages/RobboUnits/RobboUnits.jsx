import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Redirect, useHistory } from "react-router-dom"
import { Modal } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import RobboUnit from "@/components/RobboUnit"
import { Button, DragResize } from "@/components/UI"
import AddRobboUnit from "@/components/AddRobboUnit"
import { useActions } from "@/helpers/useActions"
import { getRobboUnitsState } from "@/reducers/robboUnits"
import Loader from "@/components/Loader"
import ListItem from "@/components/ListItem"
import { useUserIdentity, checkAccess } from "@/helpers"
import { HOME_PAGE_ROUTE, SUPER_ADMIN, UNIT_ADMIN, LOGIN_PAGE_ROUTE } from "@/constants"


export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const history = useHistory()
    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)
    const token = localStorage.getItem('token')
    const { getRobboUnits, getRobboUnitsByUnitAdminIdRequest, deleteRobboUnitRequest } = useActions()
    const { robboUnits, loading } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN]))
            switch (userRole) {
                case UNIT_ADMIN:
                    getRobboUnitsByUnitAdminIdRequest(token)
                    break
                case SUPER_ADMIN:
                    getRobboUnits(token)
                    break
            }

        return () => {
            // clear
        }
    }, [loginLoading])

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN, UNIT_ADMIN])) {
        return <Redirect to={HOME_PAGE_ROUTE} />
    } else if (!isAuth && !loginLoading) {
        return <Redirect to={LOGIN_PAGE_ROUTE} />
    }

    return (
        <PageLayout>
            <WelcomeText>Robbo Units</WelcomeText>
            {/* <DragResize
                open={openAddRobboUnit} setOpen={setOpenAddRobboUnit}
                content={() => (
                    <AddRobboUnit />
                )}
            /> */}
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
                    handleSubmit={() => history.push('/program')}
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
                                                handleDelete={robboUnitIndex => deleteRobboUnitRequest(token, robboUnit.id, robboUnitIndex)}
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