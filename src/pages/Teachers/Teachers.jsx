import React, { useState, memo } from 'react'
import { Modal, Button, Typography, List } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import ListItem from '@/components/ListItem'
import TeacherContent from '@/components/TeacherContent'
import AddTeacher from '@/components/AddTeacher'
import { useActions } from '@/helpers/useActions'
import { DragResize } from '@/components/UI'
import { deleteTeacher } from '@/actions'
import { formatUserDisplayName } from '@/helpers'
import { PageContent, PageToolbar } from '@/components/AccountShell'

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
        <PageContent>
            <Modal
                title={intl.formatMessage({ id: 'teachers.modal_title' })}
                open={openAddTeacher}
                footer={[]}
                onCancel={() => setOpenAddTeacher(false)}
                width='min(520px, calc(100vw - 2rem))'
            >
                <AddTeacher />
            </Modal>
            <PageToolbar>
                <Title level={2}>
                    <FormattedMessage id='teachers.title' />
                </Title>
                <Button type='primary' onClick={() => setOpenAddTeacher(true)}>
                    <FormattedMessage id='teachers.create_teacher' />
                </Button>
            </PageToolbar>
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
                        label={formatUserDisplayName(userHttp)}
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
        </PageContent>
    )
})

export default Teachers
