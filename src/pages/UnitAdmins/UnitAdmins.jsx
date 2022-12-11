import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { redirect } from "react-router-dom"
import { Modal } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import { DragResize, Button } from '@/components/UI'
import ListItem from '@/components/ListItem'
import Flex from '@/components/Flex'
import AddUnitAdmin from "@/components/AddUnitAdmin"

import { getUnitAdminsState } from "@/reducers/unitAdmins"
import Loader from "@/components/Loader"
import { useUserIdentity, checkAccess } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import UnitAdminContent from "@/components/UnitAdminContent"
import { SUPER_ADMIN, HOME_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from "@/constants"
import { deleteUnitAdmin, getUnitAdmins, clearUnitAdminsPageState } from '@/actions'

export default () => {
    const { userRole, isAuth, loginLoading } = useUserIdentity()

    const token = localStorage.getItem('token')
    const [openAddUnitAdmin, setOpenAddUnitAdmin] = useState(false)
    const { loading, unitAdmins } = useSelector(({ unitAdmins }) => getUnitAdminsState(unitAdmins))
    const actions = useActions({ deleteUnitAdmin, getUnitAdmins, clearUnitAdminsPageState }, [])

    useEffect(() => {
        if (!loginLoading && checkAccess(userRole, [SUPER_ADMIN]))
            actions.getUnitAdmins(token)
        return () => actions.clearUnitAdminsPageState()
    }, [loginLoading])

    if (!loginLoading && !checkAccess(userRole, [SUPER_ADMIN])) {
        return redirect(HOME_PAGE_ROUTE)
    } else if (!isAuth && !loginLoading) {
        return redirect(LOGIN_PAGE_ROUTE)
    }

    return (
        <PageLayout>
            <WelcomeText>Unit Админы</WelcomeText>
            <Modal
                centered
                open={openAddUnitAdmin}
                onCancel={() => setOpenAddUnitAdmin(false)}
                footer={[]}
            >
                <AddUnitAdmin />
            </Modal>
            <Flex direction='row' justify='flex-end'
                align='flex-start'>
                <Button
                    background='green'
                    content='Добавить Unit Админа'
                    padding='0.5rem'
                    handleSubmit={() => { setOpenAddUnitAdmin(true) }}
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
                                    unitAdmins?.map((unitAdmin, index) => {
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                key={index}
                                                label={`
                                                        ${unitAdmin.userHttp.lastname}
                                                        ${unitAdmin.userHttp.firstname}
                                                        ${unitAdmin.userHttp.middlename}
                                                    `}
                                                handleDelete={unitAdminIndex => actions.deleteUnitAdmin(token, unitAdmin.userHttp.id, unitAdminIndex)}
                                                render={(open, setOpen) => (
                                                    <DragResize
                                                        open={open} setOpen={setOpen}
                                                        content={() => (
                                                            // refactor useQuery
                                                            <UnitAdminContent unitAdminId={unitAdmin.userHttp.id} />
                                                        )}
                                                    />
                                                )}
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