import React, { useState, memo } from 'react'
import { Modal, Button, Typography, List } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import ListItem from '@/components/ListItem'
import AddUnitAdmin from '@/components/AddUnitAdmin'
import UnitAdminContent from '@/components/UnitAdminContent'
import { DragResize } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import { deleteUnitAdmin } from '@/actions'
import { formatUserDisplayName } from '@/helpers'
import { PageContent, PageToolbar } from '@/components/AccountShell'

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
        <PageContent>
            <PageToolbar>
                <Title level={2}>
                    <FormattedMessage id='unit_admins.title' />
                </Title>
                <Button type='primary' onClick={() => setOpenAddUnitAdmin(true)}>
                    <FormattedMessage id='unit_admins.create_unit_admin' />
                </Button>
            </PageToolbar>
            <Modal
                centered
                title={intl.formatMessage({ id: 'unit_admins.modal_title' })}
                open={openAddUnitAdmin}
                onCancel={() => setOpenAddUnitAdmin(false)}
                footer={[]}
                width='min(520px, calc(100vw - 2rem))'
            >
                <AddUnitAdmin />
            </Modal>
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
                        label={formatUserDisplayName(userHttp)}
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
        </PageContent>
    )
})

export default UnitAdmins
