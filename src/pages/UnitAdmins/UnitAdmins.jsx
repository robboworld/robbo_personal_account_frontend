import React, { useState, memo } from "react"
import { Modal, Button, Typography, Row, Col, List } from "antd"
import { FormattedMessage, useIntl } from "react-intl"

import PageLayout from '@/components/PageLayout'
import ListItem from '@/components/ListItem'
import AddUnitAdmin from "@/components/AddUnitAdmin"
import UnitAdminContent from "@/components/UnitAdminContent"
import { DragResize } from '@/components/UI'
import { useActions } from "@/helpers/useActions"
import { deleteUnitAdmin } from '@/actions'

const { Title } = Typography

const UnitAdmins = memo(({
    data: {
        GetAllUnitAdmins,
        loading,
    },
    currentPage,
    onChangePage,
    pageSize,
}) => {
    const intl = useIntl()
    const [openAddUnitAdmin, setOpenAddUnitAdmin] = useState(false)
    const actions = useActions({ deleteUnitAdmin }, [])

    return (
        <PageLayout>
            <Row align='middle'>
                <Col span={21}>
                    <Title>
                        <FormattedMessage id='unit_admins.title' />
                    </Title>
                </Col>
                <Col span={1}>
                    <Button type='primary' onClick={() => setOpenAddUnitAdmin(true)}>
                        <FormattedMessage id='unit_admins.create_unit_admin' />
                    </Button>
                </Col>
            </Row>
            <Modal
                centered
                title={intl.formatMessage({ id: 'unit_admins.modal_title' })}
                open={openAddUnitAdmin}
                onCancel={() => setOpenAddUnitAdmin(false)}
                footer={[]}
            >
                <AddUnitAdmin />
            </Modal>
            <Row>
                <Col span={24}>
                    <List
                        className='unitAdminsList'
                        loading={loading}
                        bordered
                        size='large'
                        dataSource={GetAllUnitAdmins?.unitAdmins}
                        pagination={{
                            onChange: onChangePage,
                            total: GetAllUnitAdmins?.countRows,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                handleDelete={unitAdminIndex => actions.deleteUnitAdmin(userHttp.id, unitAdminIndex)}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                key={index}
                                render={(open, setOpen) => (
                                    <DragResize
                                        open={open} setOpen={setOpen}
                                        content={() => (
                                            <UnitAdminContent unitAdminId={userHttp.id} />
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
})

export default UnitAdmins