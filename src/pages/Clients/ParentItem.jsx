import React, { useState } from 'react'

import ParentPage from '../ParentPage'

import { DeleteButton, ParentItem, Title } from './components'

export default ({ parent }) => {
    const [open, setOpen] = useState(false)

    const toCoursePageHandler = () => {
        setOpen(true)
    }

    return (
        <ParentItem>
            <Title onClick={toCoursePageHandler}> {parent.name}</Title>
            <DeleteButton>×</DeleteButton>
            <ParentPage open={open} setOpen={setOpen} />
        </ParentItem>
    )
}