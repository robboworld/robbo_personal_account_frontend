import React, { useState } from "react"

import {
    ListChildrens, SubTitle, Title,
} from "./components"

import Flex from "@/components/Flex"
import { Button, ModalWindow } from "@/components/UI"
import ListItem from "@/components/ListItem"
import AddChildren from "@/components/AddChildren"

export default ({ client }) => {

    const [openAddChildren, setOpenAddChildren] = useState(false)

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'
                    width='100%'
                >
                    <Title>{`${client.userHttp.lastname} ${client.userHttp.firstname} ${client.userHttp.middlename}`}</Title>
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
                        />
                        <Button
                            content='Создать ребенка'
                            background='darkgreen'
                            padding='0.5rem'
                            width='20%'
                            handleSubmit={() => setOpenAddChildren(true)}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <SubTitle>Дети</SubTitle>
            <ListChildrens>
                {
                    client.children?.map(({ userHttp }, index) => {
                        return (
                            <ListItem
                                label={`${userHttp.lastname} ${userHttp.firstname} ${userHttp.middlename}`}
                                key={index}
                                render={() => { }}
                            />
                        )
                    })
                }
            </ListChildrens>
        </Flex >
    )

} 