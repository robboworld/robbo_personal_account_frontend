import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import {
    ListChildrens, SubTitle, Title,
} from "./components"

import Flex from "@/components/Flex"
import { Button, ModalWindow, SearchInput } from "@/components/UI"
import ListItem from "@/components/ListItem"
import AddChildren from "@/components/AddChildren"
import { useActions } from "@/helpers/useActions"
import { getClientsState } from "@/reducers/clients"
import Loader from "@/components/Loader"
import ProfileCard from "@/components/ProfileCard"


export default ({ client }) => {
    const {
        deleteChildRequest,
        getChildrenByParentId,
        clearChildrenState,
        searchStudent,
        createRelation,
    } = useActions()
    const token = localStorage.getItem('token')
    const [openAddChildren, setOpenAddChildren] = useState(false)
    const [openSearchSection, setOpenSearchSection] = useState(false)

    const { children, childrenLoading, searchResult } = useSelector(({ clients }) => getClientsState(clients))

    useEffect(() => {
        getChildrenByParentId(token, client.userHttp.id)
        return () => {
            clearChildrenState()
        }
    }, [])

    return (

        <Flex direction='column' width='100%'>

            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'
                    width='100%'
                >
                    <Title>Карточка родителя</Title>
                    <ProfileCard updateHandle={() => { }} profile={client.userHttp} />
                    <ModalWindow
                        open={openAddChildren} setOpen={setOpenAddChildren}
                        width='35%' height='60%'
                        content={() => (
                            <AddChildren parentId={client.userHttp.id} />
                        )}
                    />
                    <Flex width='100%' justify='flex-end'>
                        <Button
                            content='Добавить ребенка из уже существующих'
                            background='darkgreen'
                            padding='0.5rem'
                            width='40%'
                            margin='0 1rem 0 0'
                            handleSubmit={() => setOpenSearchSection(!openSearchSection)}
                        />
                        <Button
                            content='Создать ребенка'
                            background='darkgreen'
                            padding='0.5rem'
                            width='20%'
                            handleSubmit={() => setOpenAddChildren(true)}
                        />
                    </Flex>
                    {openSearchSection &&
                        <Flex
                            width='100%' margin='1rem 0 0 0'
                            direction='column'
                        >
                            <SearchInput
                                searchHandle={input => { searchStudent(token, input) }}
                            />
                            <Flex direction='column'>
                                {
                                    searchResult ? (
                                        searchResult?.map(({ userHttp }, index) => {
                                            return (
                                                <ListItem
                                                    itemIndex={index}
                                                    label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                                    key={index}
                                                    render={() => { }}
                                                    handleClick={() => createRelation(token, client.userHttp.id, userHttp.id)}
                                                // handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                                                />
                                            )
                                        })
                                    ) : "Ничего не найдено"}
                            </Flex>
                        </Flex>
                    }
                </Flex>
            </Flex>
            <SubTitle>Дети</SubTitle>
            <ListChildrens>
                {
                    childrenLoading ? <Loader />
                        : (
                            children?.map(({ userHttp }, index) => {
                                return (
                                    <ListItem
                                        itemIndex={index}
                                        label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                        key={index}
                                        render={() => { }}
                                        handleDelete={childIndex => deleteChildRequest(token, userHttp.id, childIndex)}
                                    />
                                )
                            })
                        )
                }
            </ListChildrens>
        </Flex >
    )
} 