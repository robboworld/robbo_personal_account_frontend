import React, { useState } from 'react'
import { Space, Button, Modal, List } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { gql, useQuery } from "@apollo/client"

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'

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
}
`
const ChildrenTab = ({ clientId }) => {
    const token = localStorage.getItem('token')
    const {
        deleteChildRequest,
    } = useActions()
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    const { loading, error, data } = useQuery(GET_STUDENT_BY_PARENT_ID, {
        variables: { parentId: clientId },
    })

    return (
        <React.Fragment>
            {
                loading
                    ? <LoadingOutlined />
                    : <List
                        bordered
                        dataSource={data.GetStudentsByParentId}
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

            <Space>
                <Button type='primary'>Добавить</Button>
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
            </Space>
        </React.Fragment>
    )
}

export default ChildrenTab