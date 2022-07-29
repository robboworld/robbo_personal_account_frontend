import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import { Input } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import Flex from '@/components/Flex'
import { getLoginState } from '@/reducers/login'


export default memo(() => {
    const {
        emailOnChange, passwordOnChange,
    } = useActions()

    const { user } = useSelector(({ login }) => getLoginState(login))
    const { email, password } = user

    return (
        <Flex
            direction='column' justify='space-around'
            align='center' width='100%'
        >
            <Input type='text' placeholder='Email'
                value={email} handleInput={email => emailOnChange(email)}
                margin='0 0 10px 0'
            />
            <Input type='password' placeholder='Password'
                value={password} handleInput={password => passwordOnChange(password)}
                margin='0 0 10px 0'
            />
        </Flex>
    )
})