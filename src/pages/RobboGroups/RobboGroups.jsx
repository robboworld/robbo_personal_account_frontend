import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Modal, Button, Pagination, Typography, Spin } from "antd"
import { useParams, useSearchParams } from "react-router-dom"
import { FormattedMessage, useIntl } from "react-intl"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
import AddRobboGroupWithUnitSelect from "@/components/AddRobboGroup/AddRobboGroupWithUnitSelect"
import RobboGroup from "@/components/RobboGroup"
import ListItem from "@/components/ListItem"
import { checkAccess } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupsState } from "@/reducers/robboGroups"
import { getRobboUnitsState } from "@/reducers/robboUnits"
import { DragResize } from "@/components/UI"
import {
    SUPER_ADMIN,
} from "@/constants"
import {
    getRobboGroupsByRobboUnitIdRequest,
    deleteRobboGroupRequest,
    getAllRobboGroupsRequest,
    getAllRobboGroupsForUnitAdminRequest,
    clearRobboGroupsPage,
    getRobboUnitsRequest,
    getRobboUnitsByUnitAdminIdRequest,
} from '@/actions'

const { Title } = Typography

export default ({ userRole }) => {
    const intl = useIntl()
    const [openAddGroup, setOpenAddGroup] = useState(false)
    const actions = useActions({
        getRobboGroupsByRobboUnitIdRequest,
        deleteRobboGroupRequest,
        getAllRobboGroupsRequest,
        getAllRobboGroupsForUnitAdminRequest,
        clearRobboGroupsPage,
        getRobboUnitsRequest,
        getRobboUnitsByUnitAdminIdRequest,
    }, [])

    const { robboUnitId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'

    const { robboGroups, countRows, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))
    const { robboUnits } = useSelector(({ robboUnits }) => getRobboUnitsState(robboUnits))

    useEffect(() => {
        if (robboUnitId)
            actions.getRobboGroupsByRobboUnitIdRequest(robboUnitId)
        else if (checkAccess(userRole, [SUPER_ADMIN]))
            actions.getAllRobboGroupsRequest(currentPage, "10")
        else
            actions.getAllRobboGroupsForUnitAdminRequest(currentPage, "10")

        if (!robboUnitId && (!robboUnits || robboUnits.length === 0)) {
            if (checkAccess(userRole, [SUPER_ADMIN])) {
                actions.getRobboUnitsRequest("1", "100")
            } else {
                actions.getRobboUnitsByUnitAdminIdRequest("1", "100")
            }
        }

        return () => {
            actions.clearRobboGroupsPage()
        }
    }, [currentPage, robboUnitId])

    const handleDeleteGroup = (robboGroup, index) => {
        const groupRobboUnitId = robboGroup.robboUnitId || robboUnitId
        actions.deleteRobboGroupRequest(groupRobboUnitId, robboGroup.id, index)
    }

    return (
        <PageLayout>
            <Title>
                <FormattedMessage id='robbo_groups.title' />
            </Title>
            <Modal
                centered
                title={intl.formatMessage({ id: 'robbo_groups.modal_title' })}
                open={openAddGroup}
                onCancel={() => setOpenAddGroup(false)}
                footer={[]}
            >
                <AddRobboGroupWithUnitSelect robboUnitId={robboUnitId} />
            </Modal>
            <Flex direction='row' justify='flex-end'
                align='flex-start'>
                <Button
                    onClick={() => setOpenAddGroup(true)} type='primary'
                >
                    <FormattedMessage id='robbo_groups.create_robbo_group' />
                </Button>
            </Flex>
            {
                loading ? <Spin />
                    : (
                        <Flex
                            widht='100%' direction='column'
                            justify=' center'
                        >
                            {/* TODO refactor list from antd */}
                            <Flex direction='column'>
                                {
                                    robboGroups?.map((robboGroup, index) => {
                                        const groupRobboUnitId = robboGroup.robboUnitId || robboUnitId
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                key={index}
                                                label={robboGroup.name}
                                                render={(open, setOpen) => (
                                                    <DragResize
                                                        open={open} setOpen={setOpen}
                                                        content={() => (
                                                            <RobboGroup
                                                                robboUnitId={groupRobboUnitId}
                                                                robboGroupId={robboGroup.id}
                                                            />
                                                        )}
                                                    />
                                                )}
                                                handleDelete={
                                                    () => handleDeleteGroup(robboGroup, index)
                                                }
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