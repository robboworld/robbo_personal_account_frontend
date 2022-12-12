import React, { useState } from "react"
import styled from "styled-components"
import { Button, Space, Input, List } from "antd"
import { useQuery } from "@apollo/client"

import { useActions } from "@/helpers/useActions"
import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { robboUnitGQL, robboUnitQueryGraphQL } from "@/graphQL/query"
import {
    setNewUnitAdminForRobboUnitRequest,
    deleteUnitAdminForRobboUnitRequest,
} from '@/actions'

const { Search } = Input

export default ({ robboUnitId }) => {
    const token = localStorage.getItem('token')
    const [searchItems, setSearchResult] = useState([])
    const actions = useActions({
        setNewUnitAdminForRobboUnitRequest,
        deleteUnitAdminForRobboUnitRequest,
    }, [])

    const [openSearchSection, setOpenSearchSection] = useState(false)

    const SearchUnitAdmins = async value => {
        const result = await robboUnitQueryGraphQL.SearchUnitAdminByEmail({ email: value })
        setSearchResult(result.data.SearchUnitAdminsByEmail)
    }

    const getUnitAdminsByRobboUnitIdResult = useQuery(robboUnitGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID, {
        variables: { robboUnitId },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            Unit Админы
            {
                getUnitAdminsByRobboUnitIdResult?.loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={getUnitAdminsByRobboUnitIdResult.data.GetUnitAdminsByRobboUnitId.unitAdmins}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                render={() => { }}
                                handleDelete={childIndex => actions.deleteUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnitId)}
                            />
                        )}
                    />
            }
            <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Назначить</Button>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search placeholder='Введите email' onSearch={SearchUnitAdmins}
                        enterButton />
                    <List
                        bordered
                        dataSource={searchItems}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => actions.setNewUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnitId)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}

export const Title = styled.h1`
    display: flex;
    align-items: center;
    justify-content: center
    width: 100%;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
`