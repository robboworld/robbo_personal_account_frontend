import React, { memo } from 'react'

import { Text } from './components'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createUnitAdmin } from '@/actions'

export default memo(() => {
    const actions = useActions({ createUnitAdmin }, [])
    const token = localStorage.getItem('token')

    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <Text>Добавление Unit Админа</Text>
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={unitAdmin => actions.createUnitAdmin(token, unitAdmin)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />

        </Flex>
    )
})