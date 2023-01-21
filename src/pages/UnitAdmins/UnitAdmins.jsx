import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Modal, Button } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import { DragResize } from '@/components/UI'
import ListItem from '@/components/ListItem'
import Flex from '@/components/Flex'
import AddUnitAdmin from "@/components/AddUnitAdmin"
import UnitAdminContent from "@/components/UnitAdminContent"
import { getUnitAdminsState } from "@/reducers/unitAdmins"
import Loader from "@/components/Loader"
import { useActions } from "@/helpers/useActions"
import { deleteUnitAdmin, getUnitAdmins, clearUnitAdminsPageState } from '@/actions'

export default () => {
    const [openAddUnitAdmin, setOpenAddUnitAdmin] = useState(false)
    const { loading, unitAdmins } = useSelector(({ unitAdmins }) => getUnitAdminsState(unitAdmins))
    const actions = useActions({ deleteUnitAdmin, getUnitAdmins, clearUnitAdminsPageState }, [])

    useEffect(() => {
        actions.getUnitAdmins("page", "pageSize")
        return () => actions.clearUnitAdminsPageState()
    }, [])

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
                <Button type='primary' onClick={() => setOpenAddUnitAdmin(true)}>
                    Добавить Unit Админа
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
                                                handleDelete={unitAdminIndex => actions.deleteUnitAdmin(unitAdmin.userHttp.id, unitAdminIndex)}
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