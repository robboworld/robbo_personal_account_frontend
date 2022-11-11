import React, { useEffect, useState } from 'react'
import { Space, Button, Modal, List, Input, Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { gql, useQuery, useLazyQuery, useApolloClient } from "@apollo/client"

import { race } from 'redux-saga/effects'

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'

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

const SEARCH_STUDENTS_BY_EMAIL = gql`
query SearchStudentsByEmail($email: String!) {
    SearchStudentsByEmail(email: $email) {
        userHttp{
            id
            email
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
        deleteChildRequest,
    } = useActions()
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchStudents, setSearchResult] = useState([])
    const [students, setStudents] = useState([])


    const getStudentsResult = useQuery(GET_STUDENT_BY_PARENT_ID, {
        variables: { parentId: clientId },
        notifyOnNetworkStatusChange: true,
    })

    // const [searchStudents, searchRequest] = useLazyQuery(SEARCH_STUDENTS_BY_EMAIL, {
    //     variables: { email },
    //     notifyOnNetworkStatusChange: true,
    // })

    const GetStudentsByParentId = async clientId => {
        const result = await client.query({
            query: GET_STUDENT_BY_PARENT_ID,
            variables: { parentId: clientId },
        })
        setStudents(result.data.GetStudentsByParentId)
        console.log(result)
    }

    const SearchStudents = async value => {
        const result = await client.query({
            query: SEARCH_STUDENTS_BY_EMAIL,
            variables: { email: value },
        })
        console.log("search")
        console.log(result)
        setSearchResult(result.data.SearchStudentsByEmail)
    }

    return (
        // <React.Fragment>
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