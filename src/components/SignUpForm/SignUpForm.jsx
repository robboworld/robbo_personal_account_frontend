import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import { Input } from '@/components/UI'
import { useActions } from '@/helpers/useActions'
import Flex from '@/components/Flex'
import { getLoginState } from '@/reducers/login'


export default memo(() => {
    const {
        emailOnChange, passwordOnChange, nicknameOnChange,
        lastnameOnChange, firstnameOnChange, middlenameOnChange,
    } = useActions()

    const { user } = useSelector(({ login }) => getLoginState(login))
    const { email, nickname, password, lastname, firstname, middlename } = user

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
            <Input type='text' placeholder='Никнейм'
                value={nickname} handleInput={nickname => nicknameOnChange(nickname)}
                margin='0 0 10px 0'
            />
            <Input type='text' placeholder='Фамилия'
                value={lastname} handleInput={lastname => lastnameOnChange(lastname)}
                margin='0 0 10px 0'
            />
            <Input type='text' placeholder='Имя'
                value={firstname} handleInput={firstname => firstnameOnChange(firstname)}
                margin='0 0 10px 0'
            />
            <Input type='text' placeholder='Отчество'
                value={middlename} handleInput={middlename => middlenameOnChange(middlename)}
                margin='0 0 10px 0'
            />
        </Flex>
    )
})