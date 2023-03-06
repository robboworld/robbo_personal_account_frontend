import React, { useState } from "react"
import { Modal, Button, Typography, Row, Col, List } from "antd"
import { FormattedMessage, useIntl } from "react-intl"

import PageLayout from '@/components/PageLayout'
import RobboUnit from "@/components/RobboUnit"
import ListItem from "@/components/ListItem"
import AddRobboUnit from "@/components/AddRobboUnit"
import { useActions } from "@/helpers/useActions"
import { DragResize } from "@/components/UI"
import { deleteRobboUnitRequest } from '@/actions'

const { Title } = Typography

const RobboUnits = ({
    GetRobboUnitsSuperAdmin,
    GetRobboUnitsUnitAdmin,
    currentPage,
    pageSize,
    onChangePage,
}) => {
    const intl = useIntl()
    let data
    GetRobboUnitsSuperAdmin
        ? data = GetRobboUnitsSuperAdmin?.GetAllRobboUnits
        : data = GetRobboUnitsUnitAdmin?.GetRobboUnitsByAccessToken
    const [openAddRobboUnit, setOpenAddRobboUnit] = useState(false)
    const actions = useActions({
        deleteRobboUnitRequest,
    }, [])

    return (
        <PageLayout>
            <Modal
                title={intl.formatMessage({ id: 'robbo_units.modal_title' })}
                centered
                open={openAddRobboUnit}
                onCancel={() => setOpenAddRobboUnit(false)}
                footer={[]}
            >
                <AddRobboUnit />
            </Modal>
            <Row align='middle'>
                <Col span={20}>
                    <Title>
                        <FormattedMessage id='robbo_units.title' />
                    </Title>
                </Col>
                <Col span={1}>
                    <Button
                        onClick={() => setOpenAddRobboUnit(true)} type='primary'
                    >
                        <FormattedMessage id='robbo_units.create_robbo_unit' />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        loading={data?.loading}
                        bordered
                        size='large'
                        dataSource={data?.robboUnits}
                        pagination={{
                            onChange: onChangePage,
                            total: data?.countRows,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={(robboUnit, index) => (
                            <ListItem
                                itemIndex={index}
                                handleDelete={robboUnitIndex => actions.deleteRobboUnitRequest(robboUnit.id, robboUnitIndex)}
                                label={`${robboUnit.name}`}
                                key={index}
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
                            />
                        )}
                    />
                </Col>
            </Row>
        </PageLayout>
    )
}

export default RobboUnits