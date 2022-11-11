import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { gql, useQuery } from "@apollo/client"
import { Tabs } from 'antd'

import ChildrenTab from "./ChildrenTab"

import Flex from "@/components/Flex"
import ListItem from "@/components/ListItem"
import AddChildren from "@/components/AddChildren"
import { useActions } from "@/helpers/useActions"
import { getClientsState } from "@/reducers/clients"
import Loader from "@/components/Loader"
import ProfileCard from "@/components/ProfileCard"

const GET_PARENT_BY_ID = gql`
query GetParentById($parentId: String!){
    GetParentById(parentId: $parentId) {
        userHttp{
            id
            lastname
            firstname
            middlename
            nickname
            email
            createdAt
            role
        }
    }
}
`

export default ({ clientId }) => {
    const {
        updateProfile,
        deleteChildRequest,
        getChildrenByParentId,
        clearChildrenState,
        searchStudent,
        createRelation,
    } = useActions()
    const token = localStorage.getItem('token')
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    // refactor useQuery
    useEffect(() => {
        getChildrenByParentId(token, clientId)
        return () => {
            clearChildrenState()
        }
    }, [])

    const { loading, error, data } = useQuery(GET_PARENT_BY_ID, {
        variables: { parentId: clientId },
    })

    // refactor 
    const { children, childrenLoading, searchResult, client, clientLoading } = useSelector(({ clients }) => getClientsState(clients))

    return (

        <Flex direction='column' width='100%'>

            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'
                    width='100%'
                >
                    Карточка родителя
                    <Tabs
                        defaultActiveKey='1'
                        items={[
                            {
                                label: 'Профиль',
                                key: '1',
                                children: loading ? <Loader /> : <ProfileCard updateHandle={updateProfile} profile={data.GetParentById?.userHttp} />,
                            },
                            {
                                label: 'Дети',
                                key: '2',
                                children: <ChildrenTab clientId={clientId} />,
                            },
                        ]}
                    />
                </Flex>
            </Flex>
        </Flex >
    )
} 