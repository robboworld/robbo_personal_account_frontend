import React from "react"
import { useSelector } from "react-redux"

import { ListChildrens, SubTitle, Title } from "./components"
import ChildrenItem from "./ChildrenItem"

import { PageLayout, Card } from "@/layouts"

import SideBar from "@/components/SideBar"
import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import { getClientPage } from "@/reducers/clientPage"

export default props => {

    const clientPage = useSelector(state => getClientPage(state.clientPage))

    return (
        <PageLayout>
            <Card>
                <SideBar />
                <Flex padding='2rem' direction='column'>
                    <Title>{clientPage.name}</Title>
                    <Flex margin='1rem 0 1rem 0' direction='row'>
                        <Button
                            content='Добавить ребенка'
                            background='darkgreen'
                            padding='0.5rem'
                            margin='0 0.3rem 0 0'
                        />
                        <Button
                            content='Удалить ребенка'
                            background='darkgrey'
                            padding='0.5rem'
                        />
                    </Flex>
                </Flex>
                <SubTitle>Дети</SubTitle>
                <ListChildrens>
                    {
                        clientPage.childrens?.map((children, index) => {
                            return (
                                <ChildrenItem
                                    children={children}
                                    key={index}
                                />
                            )
                        })
                    }
                </ListChildrens>
            </Card>
        </PageLayout>
    )

} 