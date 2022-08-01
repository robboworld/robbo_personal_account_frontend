import React from "react"

import {
    ListChildrens, SubTitle, Title,
} from "./components"

import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import ListItem from "@/components/ListItem"

export default ({ client }) => {

    // const clientPage = useSelector(state => getClientPage(state.clientPage))

    return (
        <Flex direction='column' width='100%'>
            <Flex padding='0 1rem' direction='column'>
                <Flex direction='column' align='center'>
                    <Title>{`${client.lastname} ${client.firstname} ${client.middlename}`}</Title>
                    <Button
                        content='Добавить ребенка'
                        background='darkgreen'
                        padding='0.5rem'
                        width='20%'
                    />
                </Flex>
            </Flex>
            <SubTitle>Дети</SubTitle>
            <ListChildrens>
                {
                    client.childrens?.map((children, index) => {
                        return (
                            <ListItem
                                label={children.name}
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