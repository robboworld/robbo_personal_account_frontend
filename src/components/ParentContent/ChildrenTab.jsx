import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Space, Button, Col, List, Input, Row, Modal } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'

const { Search } = Input

const ChildrenTab = ({
    intl,
    parentId,
    email,
    GetStudents,
    SearchStudent,
    SearchStudentsResult,
    CreateStudentParentRelation,
    DeleteStudent,
    openProfileStudent,
}) => {
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    console.log(SearchStudentsResult?.SearchStudentsByEmail?.countRows)
    const loadMoreData = () => {
        SearchStudent(email)
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
                        handleDelete={() => DeleteStudent({
                            variables: {
                                studentId: userHttp.id,
                            },
                        },
                        )}
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
                        <InfiniteScroll
                            dataLength={SearchStudentsResult?.SearchStudentsByEmail?.countRows}
                            next={loadMoreData}
                            hasMore={SearchStudentsResult?.SearchStudentsByEmail?.countRows < 50}
                            loader={SearchStudentsResult?.loading}
                            scrollableTarget='scrollableDiv'
                        >
                            <List
                                // loading={SearchStudentsResult?.loading}
                                bordered
                                dataSource={SearchStudentsResult?.SearchStudentsByEmail?.students}
                                renderItem={({ userHttp }, index) => (
                                    <ListItem
                                        itemIndex={index}
                                        key={index}
                                        render={() => { }}
                                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        handleClick={() => CreateStudentParentRelation({
                                            variables: {
                                                parentId: parentId,
                                                childId: userHttp.id,
                                            },
                                        })}
                                    />
                                )}
                            />
                        </InfiniteScroll>
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