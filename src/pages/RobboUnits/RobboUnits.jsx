import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Modal, Button, Space, Pagination } from "antd"

import { WelcomeText } from "./components"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import RobboUnit from "@/components/RobboUnit"
import Loader from "@/components/Loader"
import ListItem from "@/components/ListItem"
import AddRobboUnit from "@/components/AddRobboUnit"
import { useActions } from "@/helpers/useActions"
import { getRobboUnitsState } from "@/reducers/robboUnits"
import { DragResize } from "@/components/UI"
import {
    SUPER_ADMIN,
    UNIT_ADMIN,
} from "@/constants"
import {
    getRobboUnitsRequest,
    getRobboUnitsByUnitAdminIdRequest,
    deleteRobboUnitRequest,
    clearRobboUnitsPage,
} from '@/actions'

export default ({ userRole }) => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'
    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)
    const actions = useActions({
        getRobboUnitsRequest,
        getRobboUnitsByUnitAdminIdRequest,
        deleteRobboUnitRequest,
        clearRobboUnitsPage,
    }, [])
    const { robboUnits, countRows, loading } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        switch (userRole) {
            case UNIT_ADMIN:
                actions.getRobboUnitsByUnitAdminIdRequest(currentPage, "10")
                break
            case SUPER_ADMIN:
                actions.getRobboUnitsRequest(currentPage, "10")
                break
        }

        return () => actions.clearRobboUnitsPage()
    }, [currentPage])

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
                <Space>
                    <Button
                        type='primary' onClick={() => navigate('/program')}
                    >
                        Программа
                    </Button>
                    <Button
                        onClick={() => setOpenAddRobboUnit(true)} type='primary'
                    >
                        Добавить Robbo Unit
                    </Button>
                </Space>


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
                                                handleDelete={robboUnitIndex => actions.deleteRobboUnitRequest(robboUnit.id, robboUnitIndex)}
                                            />
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    )
            }
            <Pagination
                defaultCurrent={1} defaultPageSize={10}
                total={countRows} current={+currentPage}
                onChange={(page, pageSize) => {
                    setSearchParams({ page })
                }}
            />
        </PageLayout>
    )
}