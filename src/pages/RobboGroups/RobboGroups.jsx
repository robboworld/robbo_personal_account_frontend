import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Modal, Button, Pagination, Typography } from "antd"
import { useParams, useSearchParams } from "react-router-dom"
import { FormattedMessage, useIntl } from "react-intl"

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"
import Loader from "@/components/Loader"
import AddStudentGroup from "@/components/AddRobboGroup"
import RobboGroup from "@/components/RobboGroup"
import ListItem from "@/components/ListItem"
import { checkAccess } from "@/helpers"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupsState } from "@/reducers/robboGroups"
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
    }, [])

    const { robboUnitId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') || '1'

    useEffect(() => {
        if (robboUnitId)
            actions.getRobboGroupsByRobboUnitIdRequest(robboUnitId)
        else if (checkAccess(userRole, [SUPER_ADMIN]))
            actions.getAllRobboGroupsRequest(currentPage, "10") // Только для Super Admin
        else
            actions.getAllRobboGroupsForUnitAdminRequest(currentPage, "10") // For UnitAdmin
        return () => {
            actions.clearRobboGroupsPage()
        }
    }, [currentPage])

    const { robboGroups, countRows, loading } = useSelector(({ robboGroups }) => getRobboGroupsState(robboGroups))

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
                <AddStudentGroup robboUnitId={robboUnitId} />
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