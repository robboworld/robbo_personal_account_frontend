import React from 'react'

import { useHistory } from 'react-router-dom'

import { ParentItem, Title } from './components'

export default ({ parent }) => {
    const history = useHistory()

    const toCoursePageHandler = () => {
        history.push(`/client/${parent.id}`)
    }

    return (
        <ParentItem>
            <Title onClick={toCoursePageHandler}> {parent.name}</Title>
        </ParentItem>
    )
}