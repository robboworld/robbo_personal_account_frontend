import React from 'react'

import {
    StyledModal, ModalCard,
    CloseModalButton,
} from "./components"

import Flex from '@/components/Flex'
import StyledSpan from '@/components/UI/Span'

export default ({
    title,
    content,
    footer,
    width,
    height,
    open,
    setOpen,
}) => {
    return (

        <StyledModal
            open={open}
            onClose={() => setOpen(false)}
        >
            <ModalCard width={width} height={height} >
                <Flex direction='column' height='20%'>
                    <Flex direction='row' justify='space-between'
                        align='center'>
                        <Flex width='100%' justify='center'>
                            <StyledSpan content={title} />
                        </Flex>
                        <CloseModalButton onClick={() => setOpen(false)}>×</CloseModalButton>
                    </Flex>
                </Flex>
                <Flex height='50%'>
                    {
                        content()
                    }
                </Flex>
                <Flex height='20%'>
                    {
                        footer()
                    }
                </Flex>

            </ModalCard>

        </StyledModal>

    )
}