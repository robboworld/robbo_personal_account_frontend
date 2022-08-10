import React, { memo } from 'react'

import { Text } from './components'

import Flex from '@/components/Flex'
import RobboUnitForm from '@/components/RobboUnitForm'

export default memo(() => {
    // const { addParent } = useActions()
    const token = localStorage.getItem('token')
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление Robbo Unit</Text>
            <RobboUnitForm
                margin='0 0 10px 0'
                // handleSubmit={}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})