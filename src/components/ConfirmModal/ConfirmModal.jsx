import React from "react"
import styled from "styled-components"

import Flex from "@/components/Flex"
import { Button } from "@/components/UI"

export default ({
    message,
    yesHandle,
    canselHandle,
}) => {
    return (
        <Flex
            direction='column' justify='center'
            width='100%'
        >
            <Flex justify='center' width='100%'>
                <Text>{message}</Text>
            </Flex>
            <Flex
                align='space-between' justify='center'
                margin='10px 0'
            >
                <Button
                    background='green'
                    content='Да'
                    padding='10px'
                    width='30%'
                    margin='0 10px 0 0'
                    handleSubmit={() => {
                        yesHandle()
                    }}
                />
                <Button
                    background='darkred'
                    content='Отмена'
                    padding='10px'
                    width='30%'
                    handleSubmit={() => {
                        canselHandle()
                    }}
                />
            </Flex>
        </Flex>
    )
}

const Text = styled.p`
    font-size: 1.5rem;
`