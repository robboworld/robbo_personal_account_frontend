import React, { useState } from "react"
import { Button, Space, Input, List } from "antd"
import { useQuery } from "@apollo/client"

import { useActions } from "@/helpers/useActions"
import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import { userGQL, usersQueryGraphQL } from "@/graphQL/query"


const { Search } = Input

export default ({ robboGroupId, robboUnitId }) => {
    const token = localStorage.getItem('token')
    const [searchItems, setSearchResult] = useState([])
    const {
        addStudentToRobboGroupRequest,
    } = useActions()

    const [openSearchSection, setOpenSearchSection] = useState(false)

    const SearchStudents = async value => {
        const result = await usersQueryGraphQL.searchStudentsByEmail(value, "0")
        setSearchResult(result.data.SearchStudentsByEmail)
    }

    const getStudentsByRobboGroupIdResult = useQuery(userGQL.GET_STUDENTS_BY_ROBBO_GROUP_ID, {
        variables: { robboGroupId },
        notifyOnNetworkStatusChange: true,
    })
    console.log(searchItems)

    return (
        <Space direction='vertical' style={{ margin: '0.5rem', width: '100%' }}>
            Ученики
            {
                getStudentsByRobboGroupIdResult?.loading
                    ? <Loader />
                    : <List
                        bordered
                        dataSource={getStudentsByRobboGroupIdResult.data.GetStudentsByRobboGroup}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                render={() => { }}
                                handleDelete={childIndex => addStudentToRobboGroupRequest(token, { id: 'NULL', robboUnitId: 'NULL' }, userHttp.id)}
                            />
                        )}
                    />
            }
            <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Добавить ученика</Button>
            {
                openSearchSection &&
                <React.Fragment>
                    <Search placeholder='Введите email' onSearch={SearchStudents}
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
                                handleClick={() => addStudentToRobboGroupRequest(token, { id: robboGroupId + "", robboUnitId: robboUnitId + "" }, userHttp.id)}
                                handleDelete={false}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}
