import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { Select } from 'antd'

import { Input, Button } from '@/components/UI'
import Flex from '@/components/Flex'
import {
    FREE_LISTENER, PARENT, STUDENT,
    TEACHER, UNIT_ADMIN, SUPER_ADMIN, userRole,
} from '@/constants'

export default memo(({
    margin, handleSubmit,
    needSelectRole, buttonOption,
}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
            {
                needSelectRole &&
                <React.Fragment>
                    <Text>Выберите роль</Text>
                    <Select
                        options={roles}
                        onChange={value => setRole(roles[value])}
                        value={role}
                        style={{ width: '70%' }}
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
                            role,
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