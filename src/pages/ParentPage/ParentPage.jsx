import React from "react"
import { useSelector } from "react-redux"

import {
    StyledModal, ModalCard, ListChildrens,
    SubTitle, Title, CloseModalButton,
} from "./components"

import Flex from "@/components/Flex"
import Button from "@/components/UI/Button"
import { getClientPage } from "@/reducers/clientPage"
import ListItem from "@/components/ListItem"

export default ({ open, setOpen }) => {

    const clientPage = useSelector(state => getClientPage(state.clientPage))

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <StyledModal
            open={open}
            onClose={handleClose}
        >
            <ModalCard>
                <Flex padding='2rem 2rem 0 2rem' direction='column'>
                    <Flex direction='row' justify='space-between'>
                        <Title>{clientPage.name}</Title>
                        <CloseModalButton onClick={handleClose}>×</CloseModalButton>
                    </Flex>
                    <Button
                        content='Добавить ребенка'
                        background='darkgreen'
                        padding='0.5rem'
                        margin='0 0.3rem 0 0'
                        width='400px'
                    />
                </Flex>
                <SubTitle>Дети</SubTitle>
                <ListChildrens>
                    {
                        clientPage.childrens?.map((children, index) => {
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
            </ModalCard>
        </StyledModal>
    )

} 