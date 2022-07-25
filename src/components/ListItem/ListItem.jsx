import React, { useState } from 'react'

import { StyledListItem, DeleteButton, Title } from './components'

export default ({
    label,
    handleClick,
    render,
}) => {
    const [open, setOpen] = useState(false)

    return (

        <StyledListItem>
            <Title onClick={() => { setOpen(true) }}> {label}</Title>
            <DeleteButton>×</DeleteButton>
            {
                render(open, setOpen)
            }
        </StyledListItem>

    )
}