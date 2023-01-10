import React, { memo } from 'react'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createParentRequest } from '@/actions'

export default memo(() => {
    const actions = useActions({ createParentRequest }, [])
    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <SignUpForm
                margin='0 0 0 0'
                handleSubmit={parent => actions.createParentRequest(parent)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})