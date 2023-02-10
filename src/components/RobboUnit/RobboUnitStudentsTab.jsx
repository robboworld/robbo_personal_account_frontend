import React, { useState } from "react"
import { Button, Space, Input, List, Modal } from "antd"
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import ListItem from "@/components/ListItem"
import AddChildren from "@/components/AddChildren"
import { PROFILE_PAGE_ROUTE } from "@/constants"
import { addStudentToRobboGroupRequest } from "@/actions"
import { useActions } from "@/helpers/useActions"

const { Search } = Input

const RobboUnitStudentsTab = ({
    robboUnitId,
    disableСhanges,
    GetStudents,
    email,
    SearchStudent,
    SearchStudentsResult,
}) => {
    const intl = useIntl()
    const navigate = useNavigate()
    const actions = useActions({ addStudentToRobboGroupRequest }, [])

    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [openAddChildren, setOpenAddChildren] = useState(false)

    const openProfileStudent = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: 0,
            },
        })
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                bordered
                loading={GetStudents?.loading}
                dataSource={GetStudents?.GetStudentsByRobboUnitId?.students}
                renderItem={({ userHttp }, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                        render={() => { }}
                        handleClick={() => openProfileStudent(userHttp.id)}
                        handleDelete={childIndex => actions.addStudentToRobboGroupRequest({ id: 'NULL', robboUnitId: 'NULL' }, userHttp.id)}
                    />
                )}
            />
            <Button
                type='primary' disabled={disableСhanges}
                onClick={() => setOpenSearchSection(!openSearchSection)}
            >
                <FormattedMessage id='robbo_unit_card.add_student' />
            </Button>
            <Button
                type='primary' disabled={disableСhanges}
                onClick={setOpenAddChildren}
            >
                <FormattedMessage id='robbo_unit_card.create_student' />
            </Button>
            <Modal
                title={intl.formatMessage({ id: 'robbo_unit_card.modal_create_child_title' })}
                centered
                open={openAddChildren}
                onCancel={() => setOpenAddChildren(false)}
                footer={[]}
            >
                <AddChildren parentId='' />
            </Modal>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search
                        placeholder={intl.formatMessage({ id: 'robbo_unit_card.student_search_placeholder' })}
                        onSearch={SearchStudent}
                        enterButton
                    />
                    <List
                        bordered
                        dataSource={SearchStudentsResult?.SearchStudentsByEmail?.students}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => actions.addStudentToRobboGroupRequest({ id: 'NULL', robboUnitId: robboUnitId + "" }, userHttp.id)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}


RobboUnitStudentsTab.propTypes = {
    robboUnitId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboUnitStudentsTab