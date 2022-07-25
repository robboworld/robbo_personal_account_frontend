import React from 'react'

import { ChildrenItem, DeleteButton, Name } from './components'

export default ({ children }) => {

    return (
        <ChildrenItem>
            <Name> {children.name}</Name>
            <DeleteButton>×</DeleteButton>
        </ChildrenItem>
    )
}