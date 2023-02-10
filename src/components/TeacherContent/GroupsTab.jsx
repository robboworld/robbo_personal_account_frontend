import React, { useState } from 'react'
import { Space, Button, List, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery, useApolloClient } from "@apollo/client"
import { useIntl, FormattedMessage } from 'react-intl'

import ListItem from '@/components/ListItem'
import { useActions } from '@/helpers'
import { robboGroupQuerysGQL } from '@/graphQL'
import {
    setTeacherForRobboGroupRequest,
    deleteTeacherForRobboGroupRequest,
} from '@/actions'


const { Search } = Input

const GroupsTab = ({ teacherId }) => {
    const intl = useIntl()
    const actions = useActions({ setTeacherForRobboGroupRequest, deleteTeacherForRobboGroupRequest }, [])
    const client = useApolloClient()
    const history = useNavigate()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchGroups, setSearchResult] = useState([])

    const getRobboGroupsResult = useQuery(robboGroupQuerysGQL.GET_ROBBO_GROUPS_BY_TEACHER_ID, {
        variables: { teacherId, page: "1", pageSize: "10" },
        notifyOnNetworkStatusChange: true,
    })

    const SearchGroups = async value => {
        const result = await client.query({
            query: robboGroupQuerysGQL.SEARCH_GROUPS_BY_NAME,
            variables: { name: value },
        })
        setSearchResult(result.data.SearchGroupsByName.robboGroups)
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            <List
                loading={getRobboGroupsResult?.loading}
                bordered
                dataSource={getRobboGroupsResult?.data?.GetRobboGroupsByTeacherId?.robboGroups}
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
                        onSearch={SearchGroups}
                        enterButton />
                    <List
                        bordered
                        dataSource={searchGroups}
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

export default GroupsTab