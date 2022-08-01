import React, { memo } from 'react'

import { Text } from './components'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { Button } from '@/components/UI'

export default memo(() => {
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление педагога</Text>
            <SignUpForm margin='0 0 10px 0' />
            <Flex
                justify='center' align='center'
                width='100%' margin='1rem 0 2rem 0'
            >
                <Button
                    background='green'
                    content='Добавить'
                    handleSubmit={() => { }}
                    padding='10px'
                />
            </Flex>
        </Flex>
    )
})