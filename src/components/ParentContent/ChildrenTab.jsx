import React, { useState } from 'react'
import { Space, Button, Col, List, Input, Row, Modal } from 'antd'

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'
import { createStudentParentRelationRequest, deleteChildRequest } from '@/actions'

const { Search } = Input

const ChildrenTab = ({
    parentId,
    GetStudents,
    email,
    SearchStudent,
    SearchStudentsResult,
}) => {
    const actions = useActions({ createStudentParentRelationRequest, deleteChildRequest }, [])
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    return (
        <Space direction='vertical' style={{ margin: '0.5rem' }}>
            <List
                bordered
                loading={GetStudents?.loading}
                dataSource={GetStudents?.GetStudentsByParentId?.students}
                renderItem={({ userHttp }, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        render={() => { }}
                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                        handleDelete={childIndex => actions.deleteChildRequest(userHttp.id, childIndex)}
                    />
                )}
            />
            <Row gutter={[8, 8]}>
                <Col span={12}>
                    <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Добавить</Button>
                </Col>
                <Col span={12}>
                    <Button type='primary' onClick={setOpenAddChildren}>Создать </Button>
                </Col>

            </Row>
            {
                openSearchSection &&
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <Search
                            placeholder='Введите Email'
                            onSearch={SearchStudent}
                            enterButton
                        />
                    </Col>
                    <Col span={24}>
                        < List
                            bordered
                            dataSource={SearchStudentsResult?.SearchStudentsByEmail?.students}
                            renderItem={({ userHttp }, index) => (
                                <ListItem
                                    itemIndex={index}
                                    key={index}
                                    render={() => { }}
                                    label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                    handleClick={() => actions.createStudentParentRelationRequest(parentId, userHttp.id)}
                                />
                            )}
                        />
                    </Col>

                </Row>
            }
            <Modal
                title='Заполните данные ученика'
                centered
                open={openAddChildren}
                onCancel={() => setOpenAddChildren(false)}
                footer={[]}
            >
                <AddChildren parentId={parentId} />
            </Modal>
        </Space >
    )
}

export default ChildrenTab