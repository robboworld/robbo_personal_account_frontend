import React, { useState } from 'react'
import { Space, Button, Modal, List, Input, notification } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from "@apollo/client"

import ListItem from '@/components/ListItem'
import AddChildren from '@/components/AddChildren'
import { useActions } from '@/helpers'
import { studentQuerysGQL, studentQuerysGraphQL } from '@/graphQL'
import { createStudentParentRelationRequest, deleteChildRequest } from '@/actions'

const { Search } = Input

const ChildrenTab = ({ clientId }) => {
    const actions = useActions({ createStudentParentRelationRequest, deleteChildRequest }, [])
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [searchStudents, setSearchResult] = useState([])

    const getStudentsResult = useQuery(studentQuerysGQL.GET_STUDENTS_BY_PARENT_ID, {
        variables: { parentId: clientId },
        notifyOnNetworkStatusChange: true,
    })

    const SearchStudents = async value => {
        const result = await studentQuerysGraphQL.searchStudentsByEmail(value, clientId)
        setSearchResult(result.data.SearchStudentsByEmail.students)
    }

    if (getStudentsResult.error) {
        notification.error({ message: 'Ошибка', description: getStudentsResult.error })
    }

    return (
        <Space direction='vertical' style={{ margin: '0.5rem' }}>
            {
                getStudentsResult.loading
                    ? <LoadingOutlined />
                    : <List
                        bordered
                        dataSource={getStudentsResult.data.GetStudentsByParentId.students}
                        renderItem={({ userHttp }, index) => (
                            <ListItem
                                itemIndex={index}
                                key={index}
                                render={() => { }}
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                handleDelete={childIndex => actions.deleteChildRequest(userHttp.id, childIndex)}
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
                                handleClick={() => actions.createStudentParentRelationRequest(clientId, userHttp.id)}
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