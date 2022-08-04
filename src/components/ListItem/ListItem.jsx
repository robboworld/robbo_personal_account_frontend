import React, { useState } from 'react'

import { StyledListItem, DeleteButton, Title } from './components'

import { ModalWindow } from '@/components/UI'
import ConfirmModal from '@/components/ConfirmModal'

export default ({
    itemIndex,
    label,
    handleClick,
    handleDelete,
    render,
}) => {
    const [contentOpen, setContentOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <StyledListItem>
            <ModalWindow
                open={confirmOpen} setOpen={setConfirmOpen}
                width='35%' height='25%'
                content={() => (
                    <ConfirmModal
                        yesHandle={() => handleDelete(itemIndex)}
                        canselHandle={() => setConfirmOpen(false)}
                        message='Вы точно хотите удалить?'
                    />
                )}
            />
            <Title onClick={() => { setContentOpen(true) }}> {label}</Title>
            <DeleteButton onClick={e => {
                setConfirmOpen(true)
            }}>
                ×
            </DeleteButton>
            {
                render(contentOpen, setContentOpen)
            }
        </StyledListItem>

    )
}