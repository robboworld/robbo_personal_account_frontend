import React, { useState } from 'react'
import { Space, Button, List, Input } from 'antd'
import { useHistory } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { gql, useQuery, useApolloClient } from "@apollo/client"

import ListItem from '@/components/ListItem'
import { useActions } from '@/helpers'


const { Search } = Input

const GET_ROBBO_GROUPS_BY_TEACHER_ID = gql`
query GetRobboGroupsByTeacherId($teacherId: String!) {
    GetRobboGroupsByTeacherId(teacherId: $teacherId){
        id
        robboUnitId
        name
    }
}
`

const SEARCH_GROUPS_BY_NAME = gql`
query SearchGroupsByName($name: String!) {
    SearchGroupsByName(name: $name) {
        id
        name
    }
}
`

const GroupsTab = ({ teacherId }) => {
    const token = localStorage.getItem('token')
    const { setTeacherForRobboGroupRequest, deleteTeacherForRobboGroupRequest } = useActions()
    const client = useApolloClient()
    const history = useHistory()
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchGroups, setSearchResult] = useState([])

    const getRobboGroupsResult = useQuery(GET_ROBBO_GROUPS_BY_TEACHER_ID, {
        variables: { teacherId },
        notifyOnNetworkStatusChange: true,
    })

    const SearchGroups = async value => {
        const result = await client.query({
            query: SEARCH_GROUPS_BY_NAME,
            variables: { name: value },
        })
        setSearchResult(result.data.SearchGroupsByName)
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            {
                getRobboGroupsResult.loading
                    ? <LoadingOutlined />
                    : <List
                        bordered
                        dataSource={getRobboGroupsResult.data.GetRobboGroupsByTeacherId}
                        renderItem={(robboGroup, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${robboGroup?.name}`}
                                handleClick={() => history.push(`/robboUnits/${robboGroup.robboUnitId}/groups`)}
                                handleDelete={() => deleteTeacherForRobboGroupRequest(token, teacherId, robboGroup.id)}
                            />
                        )}
                    />
            }

            <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Назначить</Button>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search placeholder='Введите название группы' onSearch={SearchGroups}
                        enterButton />
                    < List
                        bordered
                        dataSource={searchGroups}
                        renderItem={(robboGroup, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${robboGroup.name}`}
                                handleClick={() => setTeacherForRobboGroupRequest(token, teacherId, robboGroup.id)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}

export default GroupsTab