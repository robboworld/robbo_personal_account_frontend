import React, { useState } from "react"
import { Button, Space, Input, List, Modal } from "antd"
import { useQuery } from "@apollo/client"
import { useNavigate } from 'react-router-dom'
import { PropTypes } from 'prop-types'

import { useActions } from "@/helpers/useActions"
import ListItem from "@/components/ListItem"
import Loader from "@/components/Loader"
import AddChildren from "@/components/AddChildren"
import { userGQL, usersQueryGraphQL } from "@/graphQL/query"
import { PEEK_PROFILE_PAGE } from "@/constants"
import { addStudentToRobboGroupRequest } from '@/actions'

const { Search } = Input

const RobboGroupStudentsTab = ({
    robboGroupId, robboUnitId,
    disableСhanges,
}) => {
    const token = localStorage.getItem('token')
    const [searchItems, setSearchResult] = useState([])
    const history = useNavigate()
    const actions = useActions({ addStudentToRobboGroupRequest }, [])

    const [openSearchSection, setOpenSearchSection] = useState(false)
    const [openAddChildren, setOpenAddChildren] = useState(false)

    const SearchStudents = async value => {
        const result = await usersQueryGraphQL.searchStudentsByEmail(value, "0")
        setSearchResult(result.data.SearchStudentsByEmail)
    }

    const getStudentsByRobboGroupIdResult = useQuery(userGQL.GET_STUDENTS_BY_ROBBO_GROUP_ID, {
        variables: { robboGroupId },
        notifyOnNetworkStatusChange: true,
    })

    const openProfileStudent = userId => {
        history(PEEK_PROFILE_PAGE, { studentId: userId })
    }

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
                                handleClick={() => openProfileStudent(userHttp.id)}
                                handleDelete={childIndex => actions.addStudentToRobboGroupRequest(token, { id: 'NULL', robboUnitId: 'NULL' }, userHttp.id)}
                            />
                        )}
                    />
            }
            <Button
                type='primary' disabled={disableСhanges}
                onClick={() => setOpenSearchSection(!openSearchSection)}
            >
                Добавить ученика
            </Button>
            <Button
                type='primary' disabled={disableСhanges}
                onClick={setOpenAddChildren}
            >
                Создать
            </Button>
            <Modal
                title='Заполните данные ученика'
                centered
                open={openAddChildren}
                onCancel={() => setOpenAddChildren(false)}
                footer={[]}
            >
                <AddChildren parentId='' />
            </Modal>
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
                                handleClick={() => actions.addStudentToRobboGroupRequest(token, { id: robboGroupId + "", robboUnitId: robboUnitId + "" }, userHttp.id)}
                                handleDelete={false}
                            />
                        )}
                    />
                </React.Fragment>
            }
        </Space>
    )
}


RobboGroupStudentsTab.propTypes = {
    robboUnitId: PropTypes.string.isRequired,
    robboGroupId: PropTypes.string.isRequired,
    disableСhanges: PropTypes.bool,
}

export default RobboGroupStudentsTab