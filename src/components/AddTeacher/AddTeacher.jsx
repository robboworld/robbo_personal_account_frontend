import React, { memo } from 'react'

import Flex from '@/components/Flex'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers/useActions'

export default memo(() => {
    const { createTeacher } = useActions()
    const token = localStorage.getItem('token')

    return (
        <Flex
            direction='column' width='100%'
            align='center'
        >
            <SignUpForm
                margin='0 0 10px 0'
                handleSubmit={teacher => createTeacher(token, teacher)}
                buttonOption={{
                    content: 'Добавить',
                    padding: '10px',
                }}
            />
        </Flex>
    )
})