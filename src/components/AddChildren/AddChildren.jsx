import React, { memo } from 'react'
import styled from 'styled-components'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers'
import { createChildrenRequest } from '@/actions'

export default memo(({ parentId, robboGroupId, robboUnitId }) => {
    const actions = useActions({ createChildrenRequest }, [])
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Создание ребенка</Text>
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={child => actions.createChildrenRequest(child, parentId.toString())}
                buttonOption={{
                    content: 'Создать',
                    padding: '10px',
                }}
                robboGroupId={robboGroupId}
                robboUnitId={robboUnitId}
            />
        </Flex>
    )
})

const Text = styled.p`
  font-size: 1.5rem;
  margin-bottom: 10px;
`