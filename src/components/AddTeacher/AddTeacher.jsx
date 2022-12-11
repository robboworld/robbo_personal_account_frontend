import React, { memo } from 'react'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'
import { createTeacher } from '@/actions'

export default memo(() => {
    const actions = useActions({ createTeacher }, [])
    const token = localStorage.getItem('token')

    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={teacher => actions.createTeacher(token, teacher)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})