import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { Space, Button, Col, List, Input, Row, Modal } from 'antd'

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'
import { createStudentParentRelationRequest, deleteChildRequest } from '@/actions'
import { STUDENT, PROFILE_PAGE_ROUTE } from '@/constants'

const { Search } = Input

const ChildrenTab = ({
    parentId,
    GetStudents,
    email,
    SearchStudent,
    SearchStudentsResult,
}) => {
    const intl = useIntl()
    const actions = useActions({ createStudentParentRelationRequest, deleteChildRequest }, [])
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    const navigate = useNavigate()
    const openProfileStudent = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: STUDENT,
            },
        })
    }

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
                        handleClick={() => openProfileStudent(userHttp.id)}
                        handleDelete={childIndex => actions.deleteChildRequest(userHttp.id, childIndex)}
                    />
                )}
            />
            <Row gutter={[8, 8]}>
                <Col span={12}>
                    <Button
                        type='primary'
                        onClick={() => setOpenSearchSection(!openSearchSection)}
                    >
                        <FormattedMessage id='parent_content.add_child' />
                    </Button>
                </Col>
                <Col span={12}>
                    <Button type='primary' onClick={setOpenAddChildren}>
                        <FormattedMessage id='parent_content.create_child' />
                    </Button>
                </Col>

            </Row>
            {
                openSearchSection &&
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <Search
                            placeholder={intl.formatMessage({ id: 'parent_content.student_search_placeholder' })}
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
                title={intl.formatMessage({ id: 'parent_content.modal_title' })}
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