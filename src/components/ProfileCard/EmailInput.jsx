import React, { useState } from "react"

import Flex from '@/components/Flex'
import { Button, Input, StyledSpan } from '@/components/UI'

export default ({
    token,
    profile,
    updateHandle,
}) => {

    const setEmailHandler = email => {
        setEmail(email)
        profile.email = email
    }

    const [email, setEmail] = useState(profile.email)
    const [emailEditMode, setEmailEditMode] = useState(false)

    return (
        <Flex
            width='100%'
            margin='0 0 10px 0'
            justify='space-between'
            align='center'
        >
            {
                emailEditMode
                    ? (
                        <Flex
                            width='100%'
                            justify='space-between'
                            align='center'
                        >
                            <Input
                                height='2rem'
                                fontSize='1rem'
                                width='100%'
                                padding='0.5rem'
                                value={email}
                                handleInput={email => { setEmailHandler(email) }}
                            />
                            <Button
                                content='Готово'
                                height='2rem'
                                padding='10px'
                                background='green'
                                margin='0 0 0 10px'
                                handleSubmit={() => {
                                    setEmailEditMode(false)
                                    updateHandle(token, profile)
                                }}
                            />
                        </Flex>
                    )
                    : (
                        <Flex width='100%' justify='space-around'
                            align='center'
                        >
                            <StyledSpan
                                size='1rem'
                                width='100%'
                                content={email}
                            />
                            <Button
                                height='2rem'
                                content='Изменить'
                                background='grey'
                                padding='0.5rem'
                                margin='0 0 0 3.5rem'
                                handleSubmit={() => { setEmailEditMode(true) }}
                            />
                        </Flex>
                    )
            }

        </Flex>
    )
}
