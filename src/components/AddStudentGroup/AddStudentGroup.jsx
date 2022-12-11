import React, { memo } from "react"
import styled from 'styled-components'

import Flex from "@/components/Flex"
import RobboGroupForm from "@/components/RobboGroupForm"
import { useActions } from "@/helpers/useActions"
import { createRobboGroupRequest } from '@/actions'

export default memo(({ robboUnitId }) => {
    const actions = useActions({ createRobboGroupRequest }, [])
    const token = localStorage.getItem('token')
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление Robbo Group</Text>
            <RobboGroupForm
                margin='0 0 10px 0'
                handleSubmit={robboGroup => actions.createRobboGroupRequest(token, robboUnitId, robboGroup)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})

const Text = styled.p`
  font-size: 1.5rem;
  margin-bottom: 10px;
`