import React, { useState } from 'react'
import { Modal, Button, Row, Col, List, Typography } from 'antd'

import PageLayout from '@/components/PageLayout'
import ListItem from '@/components/ListItem'
import ParentContentContainer from '@/components/ParentContent'
import AddParent from '@/components/AddParent/AddParent'
import { DragResize } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { deleteParentRequest } from '@/actions'

const { Title } = Typography

const Clients = ({
    data: {
        GetAllParents,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    const actions = useActions({ deleteParentRequest }, [])
    const [openAddClients, setOpenAddClients] = useState(false)

    return (
        <PageLayout>
            <Row align='middle'>
                <Col span={22}>
                    <Title>Клиенты</Title>
                </Col>
                <Col span={1}>
                    <Button type='primary' onClick={() => setOpenAddClients(true)}>
                        Добавить родителя
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        loading={loading}
                        bordered
                        size='large'
                        dataSource={GetAllParents?.parents}
                        pagination={{
                            onChange: onChangePage,
                            total: GetAllParents?.countRows,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                handleDelete={
                                    parentIndex => actions.deleteParentRequest(userHttp.id, parentIndex)
                                }
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                key={index}
                                render={(open, setOpen) => (
                                    <DragResize
                                        open={open} setOpen={setOpen}
                                        content={() => (
                                            <ParentContentContainer parentId={userHttp.id} />
                                        )}
                                    />
                                )}
                            />
                        )}
                    />
                </Col>
            </Row>
            <Modal
                title='Заполните данные клиента'
                centered
                open={openAddClients}
                onCancel={() => setOpenAddClients(false)}
                footer={[]}
            >
                <AddParent />
            </Modal>
        </PageLayout >
    )
}

export default Clients