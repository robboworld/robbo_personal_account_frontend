import React, { useState } from 'react'

import { DeleteButton, ParentItem, Title } from './components'

import ParentPage from '@/pages/ParentPage'


export default ({ parent }) => {
    const [open, setOpen] = useState(false)

    return (
        <ParentItem>
            <Title onClick={() => { setOpen(true) }}> {parent.name}</Title>
            <DeleteButton>×</DeleteButton>
            <ParentPage open={open} setOpen={setOpen} />
        </ParentItem>
    )
}