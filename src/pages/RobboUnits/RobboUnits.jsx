import React, { useState } from 'react'
import { Modal, Button, Typography, List } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import RobboUnit from '@/components/RobboUnit'
import ListItem from '@/components/ListItem'
import AddRobboUnit from '@/components/AddRobboUnit'
import { useActions } from '@/helpers/useActions'
import { DragResize } from '@/components/UI'
import { deleteRobboUnitRequest } from '@/actions'
import { PageContent, PageToolbar } from '@/components/AccountShell'

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
        <PageContent>
            <Modal
                title={intl.formatMessage({ id: 'robbo_units.modal_title' })}
                centered
                open={openAddRobboUnit}
                onCancel={() => setOpenAddRobboUnit(false)}
                footer={[]}
                width='min(520px, calc(100vw - 2rem))'
            >
                <AddRobboUnit />
            </Modal>
            <PageToolbar>
                <Title level={2}>
                    <FormattedMessage id='robbo_units.title' />
                </Title>
                <Button
                    onClick={() => setOpenAddRobboUnit(true)} type='primary'
                >
                    <FormattedMessage id='robbo_units.create_robbo_unit' />
                </Button>
            </PageToolbar>
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
        </PageContent>
    )
}

export default RobboUnits
