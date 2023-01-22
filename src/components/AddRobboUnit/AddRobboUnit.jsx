import React, { memo } from 'react'

import { Text } from './components'

import Flex from '@/components/Flex'
import RobboUnitForm from '@/components/RobboUnitForm'
import { useActions } from '@/helpers/useActions'
import { createRobboUnitRequest } from '@/actions'

export default memo(() => {
    const actions = useActions({ createRobboUnitRequest }, [])
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление Robbo Unit</Text>
            <RobboUnitForm
                margin='0 0 10px 0'
                handleSubmit={robboUnit => actions.createRobboUnitRequest(robboUnit)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})