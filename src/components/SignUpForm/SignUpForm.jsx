import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { Input, Select, Button } from '@/components/UI'
import Flex from '@/components/Flex'
import {
    FREE_LISTENER, PARENT,
    STUDENT, SUPER_ADMIN,
    TEACHER, UNIT_ADMIN,
    userRole,
} from '@/constants'

export default memo(({
    margin, handleSubmit,
    needSelectRole, buttonOption,
}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [middlename, setMiddlename] = useState('')
    const [role, setRole] = useState({})

    const roles = [
        { value: STUDENT, label: userRole[STUDENT] },
        { value: TEACHER, label: userRole[TEACHER] },
        { value: PARENT, label: userRole[PARENT] },
        { value: FREE_LISTENER, label: userRole[FREE_LISTENER] },
        { value: UNIT_ADMIN, label: userRole[UNIT_ADMIN] },
        { value: SUPER_ADMIN, label: userRole[SUPER_ADMIN] },
    ]

    return (
        <Flex
            direction='column' justify='space-around'
            align='center' width='100%'
        >
            <Input type='text' placeholder='Email'
                value={email} handleInput={email => setEmail(email)}
                margin={margin}
            />
            <Input type='password' placeholder='Password'
                value={password} handleInput={password => setPassword(password)}
                margin={margin}
            />
            <Input type='text' placeholder='Никнейм'
                value={nickname} handleInput={nickname => setNickname(nickname)}
                margin={margin}
            />
            <Input type='text' placeholder='Фамилия'
                value={lastname} handleInput={lastname => setLastname(lastname)}
                margin={margin}
            />
            <Input type='text' placeholder='Имя'
                value={firstname} handleInput={firstname => setFirstname(firstname)}
                margin={margin}
            />
            <Input type='text' placeholder='Отчество'
                value={middlename} handleInput={middlename => setMiddlename(middlename)}
                margin={margin}
            />
            {
                needSelectRole &&
                <React.Fragment>
                    <Text>Выберите роль</Text>
                    <Select
                        options={roles.slice(0, -2)}
                        onChange={role => setRole(role)}
                        value={role}
                        width='70%'
                    />
                </React.Fragment>
            }

            <Flex
                justify='center' align='center'
                width='100%' margin='1rem 0 2rem 0'
            >
                <Button
                    content={buttonOption.content}
                    handleSubmit={
                        () => handleSubmit({
                            email, password,
                            role, nickname,
                            firstname, lastname,
                            middlename,
                        })}
                    padding={buttonOption.padding}
                />
            </Flex>
        </Flex>
    )
})

const Text = styled.p`
    font-size: 16px;
`