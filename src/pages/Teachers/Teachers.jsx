import React, { useState, memo } from 'react'
import { Modal, Button, Row, Col, Typography, List } from 'antd'
import { FormattedMessage, useIntl } from "react-intl"

import PageLayout from '@/components/PageLayout'
import ListItem from '@/components/ListItem'
import TeacherContent from '@/components/TeacherContent'
import AddTeacher from '@/components/AddTeacher'
import { useActions } from '@/helpers/useActions'
import { DragResize } from '@/components/UI'
import { deleteTeacher } from '@/actions'


const { Title } = Typography

const Teachers = memo(({
    data: {
        GetAllTeachers,
        loading,
    },
    pageSize,
    currentPage,
    onChangePage,
}) => {
    const intl = useIntl()
    const actions = useActions({ deleteTeacher }, [])
    const [openAddTeacher, setOpenAddTeacher] = useState(false)
    return (
        <PageLayout>
            <Modal
                title={intl.formatMessage({ id: 'teachers.modal_title' })}
                open={openAddTeacher}
                footer={[]}
                onCancel={() => setOpenAddTeacher(false)}
            >
                <AddTeacher />
            </Modal>
            <Row align='middle'>
                <Col span={22}>
                    <Title>
                        <FormattedMessage id='teachers.title' />
                    </Title>
                </Col>
                <Col span={1}>
                    <Button type='primary' onClick={() => setOpenAddTeacher(true)}>
                        <FormattedMessage id='teachers.create_teacher' />
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <List
                        className='teachersList'
                        loading={loading}
                        bordered
                        size='large'
                        dataSource={GetAllTeachers?.teachers}
                        pagination={{
                            onChange: onChangePage,
                            total: GetAllTeachers?.countRows,
                            current: +currentPage,
                            defaultCurrent: 1,
                            defaultPageSize: pageSize,
                            responsive: true,
                        }}
                        itemLayout='vertical'
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                handleDelete={teacherIndex => actions.deleteTeacher(userHttp.id, teacherIndex)}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                key={index}
                                render={(open, setOpen) => (
                                    <DragResize
                                        open={open} setOpen={setOpen}
                                        content={() => (
                                            <TeacherContent teacherId={userHttp.id} />
                                        )}
                                    />
                                )}
                            />
                        )}
                    />
                </Col>
            </Row>
        </PageLayout >
    )
})

export default Teachers