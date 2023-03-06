import React, { useState } from 'react'
import { compose } from 'redux'
import { Space, Button, List, Input, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useIntl, FormattedMessage } from 'react-intl'
import { graphql } from '@apollo/client/react/hoc'

import ListItem from '@/components/ListItem'
import { useActions } from '@/helpers'
import { robboGroupQuerysGQL } from '@/graphQL'
import {
    setTeacherForRobboGroupRequest,
    deleteTeacherForRobboGroupRequest,
} from '@/actions'

const { Search } = Input

const GroupsTab = ({
    intl,
    teacherId,
    GetRobboGroups,
    SearchRobboGroups,
    SearchRobboGroupsResult,
}) => {
    const history = useNavigate()
    const actions = useActions({ setTeacherForRobboGroupRequest, deleteTeacherForRobboGroupRequest }, [])
    const [openSearchSection, setOpenSearchSection] = useState(false)
    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                loading={GetRobboGroups?.loading}
                bordered
                dataSource={GetRobboGroups?.GetRobboGroupsByTeacherId?.robboGroups}
                renderItem={(robboGroup, index) => (
                    <ListItem
                        itemIndex={index}
                        key={index}
                        render={() => { }}
                        label={`${robboGroup?.name}`}
                        handleClick={() => history(`/robboUnits/${robboGroup.robboUnitId}/groups`)}
                        handleDelete={() => actions.deleteTeacherForRobboGroupRequest(teacherId, robboGroup.id)}
                    />
                )}
            />

            <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>
                <FormattedMessage id='teacher_content.add_access' />
            </Button>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search
                        placeholder={intl.formatMessage({ id: 'teacher_content.student_search_placeholder' })}
                        onSearch={SearchRobboGroups}
                        enterButton />
                    <List
                        loading={SearchRobboGroupsResult?.loading}
                        bordered
                        dataSource={SearchRobboGroupsResult?.SearchGroupsByName?.robboGroups}
                        renderItem={(robboGroup, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${robboGroup.name}`}
                                handleClick={() => actions.setTeacherForRobboGroupRequest(teacherId, robboGroup.id)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}

const GroupsTabContainer = ({
    teacherId,
}) => {
    const intl = useIntl()
    const [name, setName] = useState('')
    const SearchRobboGroups = value => {
        setName(value)
    }

    return (
        <WithGraphQLComponent
            intl={intl}
            teacherId={teacherId}
            name={name}
            SearchRobboGroups={SearchRobboGroups}
        />
    )
}

const WithGraphQLComponent = compose(
    graphql(
        robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_TEACHER_ID,
        {
            options: props => {
                return {
                    variables: {
                        teacherId: props.teacherId,
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
            name: 'GetRobboGroups',
        },
    ),
    graphql(
        robboGroupQuerysGQL.SEARCH_GROUPS_BY_NAME,
        {
            options: props => {
                return {
                    variables: {
                        name: props.name,
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
            name: 'SearchRobboGroupsResult',
        },
    ),
)(GroupsTab)

export default GroupsTabContainer