import React, { useState } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { Space, List, notification, Row, Col, Button, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useIntl, FormattedMessage } from 'react-intl'
import { compose } from 'redux'

import ListItem from '@/components/ListItem'
import { teacherQuerysGQL } from '@/graphQL/query'
import { PROFILE_PAGE_ROUTE, TEACHER } from '@/constants'
import { useActions } from '@/helpers'
import {
    setTeacherForRobboGroupRequest,
    deleteTeacherForRobboGroupRequest,
} from '@/actions'

const { Search } = Input

const RobboGroupTeachersTab = ({
    intl,
    GetTeachers,
    email,
    SearchTeacher,
    SearchTeachersResult,
    robboGroupId,
}) => {
    const navigate = useNavigate()
    const actions = useActions({ setTeacherForRobboGroupRequest, deleteTeacherForRobboGroupRequest }, [])
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const openProfileTeacher = userId => {
        navigate(PROFILE_PAGE_ROUTE, {
            state: {
                userId,
                userRole: TEACHER,
            },
        })
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                bordered
                loading={GetTeachers?.loading}
                dataSource={GetTeachers?.GetTeachersByRobboGroupId?.teachers}
                renderItem={({ userHttp }, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                        render={() => { }}
                        handleClick={() => openProfileTeacher(userHttp.id)}
                        handleDelete={() => actions.deleteTeacherForRobboGroupRequest(userHttp.id, robboGroupId)}
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
            </Row>
            {
                openSearchSection &&
                <Row gutter={[0, 8]}>
                    <Col span={24}>
                        <Search
                            placeholder={intl.formatMessage({ id: 'parent_content.student_search_placeholder' })}
                            onSearch={SearchTeacher}
                            enterButton
                        />
                    </Col>
                    <Col span={24}>
                        < List
                            bordered
                            dataSource={SearchTeachersResult?.SearchTeachersByEmail?.teachers}
                            renderItem={({ userHttp }, index) => (
                                <ListItem
                                    itemIndex={index}
                                    key={index}
                                    render={() => { }}
                                    label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                    handleClick={() => actions.setTeacherForRobboGroupRequest(userHttp.id, robboGroupId)}
                                />
                            )}
                        />
                    </Col>

                </Row>
            }
        </Space>
    )
}

const RobboGroupTeachersTabContainer = ({ robboGroupId }) => {
    const intl = useIntl()
    const [email, setEmail] = useState('')
    const SearchTeacher = value => {
        setEmail(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            robboGroupId={robboGroupId}
            email={email}
            SearchTeacher={SearchTeacher}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        teacherQuerysGQL.GET_TEACHERS_BY_ROBBO_GROUP_ID,
        {
            options: props => {
                return {
                    variables: {
                        robboGroupId: props.robboGroupId,
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'GetTeachers',
        },
    ),
    graphql(
        teacherQuerysGQL.SEARCH_TEACHERS_BY_EMAIL,
        {
            options: props => {
                return {
                    variables: {
                        email: props.email || 'undenfined',
                        page: "1",
                        pageSize: "5",
                    },
                    onError: error => {
                        notification.error({
                            message: props.intl.formatMessage({ id: 'notification.error_message' }),
                            description: error?.message,
                        })
                    },
                }
            },
            name: 'SearchTeachersResult',
        },
    ),
)(RobboGroupTeachersTab)

export default RobboGroupTeachersTabContainer
