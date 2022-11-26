import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory } from 'react-router-dom'
import { Tabs } from "antd"


import RobboGroupStudentsTab from "./RobboGroupStudentsTab"

import Flex from '@/components/Flex'
import ListItem from "@/components/ListItem"
import AddChildren from "@/components/AddChildren"
import { getClientsState } from "@/reducers/clients"
import { StyledSpan, Button, DragResize, SearchInput } from "@/components/UI"
import { useActions } from "@/helpers/useActions"
import { getRobboGroupState } from "@/reducers/robboGroup"
import Loader from "@/components/Loader"
import { PEEK_PROFILE_PAGE } from "@/constants"

export default ({ robboUnitId, robboGroupId }) => {

    const token = localStorage.getItem('token')
    const {
        searchStudent,
        addStudentToRobboGroupRequest,
        getRobboGroupByIdRequest,
    } = useActions()
    const [openAddStudent, setOpenAddStudent] = useState(false)
    const [openCreateChild, setOpenCreateChild] = useState(false)

    // refactor useQuery
    useEffect(() => {
        getRobboGroupByIdRequest(token, robboUnitId, robboGroupId)
        return () => {
            // clear robboGroup {}
        }
    }, [])

    const { searchResult } = useSelector(({ clients }) => getClientsState(clients))
    const { robboGroup, loading } = useSelector(({ robboGroup }) => getRobboGroupState(robboGroup))

    const history = useHistory()

    const openProfileStudent = userId => {
        history.push(PEEK_PROFILE_PAGE, { studentId: userId })
    }

    return (
        <Flex width='100%'>
            {
                loading ? <Loader />
                    : (
                        <Flex
                            direction='column' width='100%'
                            padding='0.5rem'
                        >
                            Группа {robboGroup.name}
                            <Tabs
                                defaultActiveKey='1'
                                items={[
                                    {
                                        label: 'Карточка',
                                        key: '1',
                                        children: loading ? <Loader /> : "Карточка",
                                    },
                                    {
                                        label: 'Ученики',
                                        key: '2',
                                        children: loading ? <Loader /> : <RobboGroupStudentsTab robboGroupId={robboGroup.id} robboUnitId={robboGroup.robboUnitId} />,
                                    },
                                    {
                                        label: 'Педагоги',
                                        key: '3',
                                        children: "Педагоги",
                                    },
                                ]}
                            />
                            {/* <DragResize
                                open={openAddStudent} setOpen={setOpenAddStudent}
                                width='35%'
                                height='30%'
                                content={() => (
                                    <Flex
                                        width='100%' margin='1rem 0 0 0'
                                        direction='column'
                                    >
                                        <SearchInput
                                            searchHandle={input => { searchStudent(token, input) }}
                                            placeholder='Введите Email'
                                        />
                                        <Flex direction='column' padding='0.5rem'>
                                            {
                                                searchResult ? (
                                                    searchResult?.map(({ userHttp }, index) => {
                                                        return (
                                                            <ListItem
                                                                itemIndex={index}
                                                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                                                key={index}
                                                                render={() => { }}
                                                                handleClick={() => addStudentToRobboGroupRequest(token, robboGroup, userHttp.id)}
                                                                handleDelete={false}
                                                            />
                                                        )
                                                    })
                                                ) : "Ничего не найдено"}
                                        </Flex>
                                    </Flex>
                                )}
                            /> */}
                            {/* <DragResize
                                open={openCreateChild} setOpen={setOpenCreateChild}
                                content={() => (
                                    <AddChildren parentId='' />
                                )}
                            />
                            <Flex direction='row' justify='flex-end'
                                align='flex-start'>
                                <Button
                                    background='green'
                                    content='Добавить ученика'
                                    padding='0.5rem'
                                    handleSubmit={() => setOpenAddStudent(true)}
                                />
                                <Button
                                    content='Создать ребенка'
                                    background='green'
                                    padding='0.5rem'
                                    margin='0 0 0 0.5rem'
                                    width='20%'
                                    handleSubmit={() => setOpenCreateChild(true)}
                                />
                            </Flex>

                            <Flex direction='column'>
                                <StyledSpan content='Список учеников' />
                                {
                                    robboGroup.students?.map(({ userHttp }, index) => {
                                        return (
                                            <ListItem
                                                itemIndex={index}
                                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                                key={index}
                                                render={() => { }}
                                                handleDelete={
                                                    () => addStudentToRobboGroupRequest(token, { id: 'NULL', robboUnitId: 'NULL' }, userHttp.id)
                                                }
                                                handleClick={() => {
                                                    openProfileStudent(userHttp.id)
                                                }}
                                            // handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                                            />
                                        )
                                    })
                                }
                            </Flex> */}
                        </Flex >
                    )
            }
        </Flex>
    )
}