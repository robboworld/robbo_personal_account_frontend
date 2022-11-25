import React, { useState } from "react"
import styled from "styled-components"
import { Button, Space, Input, List } from "antd"
import { useQuery } from "@apollo/client"

import { useActions } from "@/helpers/useActions"
import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { robboUnitGQL, robboUnitQueryGraphQL } from "@/graphQL/query"


const { Search } = Input

export default ({ robboGroupId }) => {
    // const token = localStorage.getItem('token')
    // const [searchItems, setSearchResult] = useState([])
    // const {
    //     setNewUnitAdminForRobboUnitRequest,
    //     deleteUnitAdminForRobboUnitRequest,
    // } = useActions()

    // const [openSearchSection, setOpenSearchSection] = useState(false)

    // const SearchUnitAdmins = async value => {
    //     const result = await robboUnitQueryGraphQL.SearchUnitAdminByEmail({ email: value })
    //     setSearchResult(result.data.SearchUnitAdminsByEmail)
    // }

    // const getUnitAdminsByRobboUnitIdResult = useQuery(robboUnitGQL.GET_UNIT_ADMINS_BY_ROBBO_UNIT_ID, {
    //     variables: { robboUrobboGroupIdnitId },
    //     notifyOnNetworkStatusChange: true,
    // })

    // return (
    //     <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
    //         Ученики
    //         {
    //             getUnitAdminsByRobboUnitIdResult?.loading
    //                 ? <Loader />
    //                 : <List
    //                     bordered
    //                     dataSource={getUnitAdminsByRobboUnitIdResult.data.GetUnitAdminsByRobboUnitId}
    //                     renderItem={({ userHttp }, index) => (
    //                         <ListItem
    //                             itemIndex={index}
    //                             key={index}
    //                             label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
    //                             render={() => { }}
    //                             handleDelete={childIndex => deleteUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnitId)}
    //                         />
    //                     )}
    //                 />
    //         }
    //         <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Назначить</Button>
    //         {
    //             openSearchSection &&
    //             <React.Fragment>
    //                 <Search placeholder='Введите email' onSearch={SearchUnitAdmins}
    //                     enterButton />
    //                 <List
    //                     bordered
    //                     dataSource={searchItems}
    //                     renderItem={({ userHttp }, index) => (
    //                         <ListItem
    //                             itemIndex={index}
    //                             key={index}
    //                             render={() => { }}
    //                             label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
    //                             handleClick={() => setNewUnitAdminForRobboUnitRequest(token, userHttp.id, robboUnitId)}
    //                         />
    //                     )}
    //                 />
    //             </React.Fragment>
    //         }
    //     </Space>
    // )
}
