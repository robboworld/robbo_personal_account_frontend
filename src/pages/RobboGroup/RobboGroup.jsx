import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { WelcomeText } from "../Clients/components"

import { PageLayout, Card } from '@/layouts'
import SideBar from "@/components/SideBar"
import Flex from '@/components/Flex'
import ListItem from "@/components/ListItem"
import { getClientsState } from "@/reducers/clients"
import { getRobboGroupByIdRequest } from "@/actions"
import { StyledSpan, Button, ModalWindow, SearchInput } from "@/components/UI"
import { useIsAuth } from "@/helpers"
import { useActions } from "@/helpers/useActions"


export default () => {
    useIsAuth()
    const { searchStudent, addStudentToRobboGroupRequest } = useActions()
    // TODO remove token from request
    const token = localStorage.getItem('token')
    const { robboUnitId, robboGroupId } = useParams()
    const [openAddStudent, setOpenAddStudent] = useState(false)
    const { searchResult } = useSelector(({ clients }) => getClientsState(clients))
    useEffect(() => {
        getRobboGroupByIdRequest(robboUnitId)
        return () => {
            // clear robboUnit {}
        }
    }, [])

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <WelcomeText>Группа {robboGroupId}</WelcomeText>
                <ModalWindow
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
                                                    handleClick={() => addStudentToRobboGroupRequest(robboGroupId, userHttp.id)}
                                                // handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                                                />
                                            )
                                        })
                                    ) : "Ничего не найдено"}
                            </Flex>
                        </Flex>
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
                </Flex>
                <Flex direction='column'>
                    <StyledSpan content='Список учеников' />
                </Flex>
            </Card>
        </PageLayout>

    )
}