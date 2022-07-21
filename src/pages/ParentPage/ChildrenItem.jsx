import React from 'react'

import { ChildrenItem, Name } from './components'

export default ({ children }) => {

    return (
        <ChildrenItem>
            <Name> {children.name}</Name>
        </ChildrenItem>
    )
}