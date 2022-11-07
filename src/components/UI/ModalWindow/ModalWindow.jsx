import React from 'react'
import Draggable from 'react-draggable'

import {
    StyledModal, ModalCard,
    CloseModalButton,
} from "./components"

import Flex from '@/components/Flex'

export default ({
    content,
    width,
    height,
    open,
    setOpen,
}) => {
    return (
        <Draggable>
            <StyledModal
                width={width} height={height}
                open={open} onClose={() => setOpen(false)}
                hideBackdrop
            // BackdropProps={{ style: { backgroundColor: "transparent" } }}
            >
                <ModalCard>
                    <Flex
                        direction='column' width='100%'
                        justify='center' align='flex-end'
                        height='15%'
                    >
                        <CloseModalButton onClick={() => setOpen(false)}>×</CloseModalButton>
                    </Flex>

                    <Flex height='70%' width='100%'>
                        {
                            content()
                        }
                    </Flex>
                </ModalCard>

            </StyledModal>
        </Draggable>
    )
}