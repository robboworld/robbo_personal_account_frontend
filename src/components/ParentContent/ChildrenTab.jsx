import React, { useState } from 'react'
import { Space, Button, Modal, List, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { gql, useQuery, useApolloClient } from "@apollo/client"

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'
import { userGQL, usersQueryGraphQL } from '@/graphQL'

const { Search } = Input

const GET_STUDENT_BY_PARENT_ID = gql`
query GetStudentsByParentId($parentId: String!){
    GetStudentsByParentId(parentId: $parentId) {
        userHttp{
            id
            lastname
            firstname
            middlename
        }
    }
}`

const ChildrenTab = ({ clientId }) => {
    const token = localStorage.getItem('token')
    const client = useApolloClient()
    const {
        createRelation,
        deleteChildRequest,
    } = useActions()
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchStudents, setSearchResult] = useState([])

    const getStudentsResult = useQuery(GET_STUDENT_BY_PARENT_ID, {
        variables: { parentId: clientId },
        notifyOnNetworkStatusChange: true,
    })

    const SearchStudents = async value => {
        const result = await usersQueryGraphQL.searchStudentsByEmail(value, clientId)
        setSearchResult(result.data.SearchStudentsByEmail)
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem' }}>
            {
                getStudentsResult.loading
                    ? <LoadingOutlined />
                    : <List
                        bordered
                        dataSource={getStudentsResult.data.GetStudentsByParentId}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                            />
                        )}
                    />
            }


            <React.Fragment>
                <Button type='primary' onClick={() => setOpenSearchSection(!openSearchSection)}>Добавить</Button>
                <Button type='primary' onClick={setOpenAddChildren}>Создать </Button>
                <Modal
                    title='Заполните данные ученика'
                    centered
                    open={openAddChildren}
                    onCancel={() => setOpenAddChildren(false)}
                    footer={[]}
                >
                    <AddChildren parentId={clientId} />
                </Modal>
            </React.Fragment>

            {
                openSearchSection &&
                <React.Fragment>
                    <Search placeholder='Введите Email' onSearch={SearchStudents}
                        enterButton />
                    < List
                        bordered
                        dataSource={searchStudents}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleClick={() => createRelation(token, clientId, userHttp.id)}
                            // handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}

export default ChildrenTab