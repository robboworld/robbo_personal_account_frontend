import React, { useState } from "react"

import Flex from '@/components/Flex'
import { Button, Input, StyledSpan } from '@/components/UI'

export default ({
    token,
    profile,
    updateHandle,
}) => {

    const setLastnameHandler = lastname => {
        setLastname(lastname)
        profile.lastname = lastname
    }


    const [lastname, setLastname] = useState(profile.lastname)
    const [lastnameEditMode, setLastnameEditMode] = useState(false)

    return (
        <Flex
            width='100%'
            justify='space-between'
            align='center'
            margin='0 0 10px 0'
        >
            {
                lastnameEditMode
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
                                value={lastname}
                                handleInput={lastname => setLastnameHandler(lastname)}
                            />
                            <Button
                                content='Готово'
                                height='2rem'
                                padding='10px'
                                background='green'
                                margin='0 0 0 10px'
                                handleSubmit={() => {
                                    setLastnameEditMode(false)
                                    updateHandle(token, profile)
                                }}
                            />
                        </Flex>
                    )
                    : (
                        <Flex
                            width='100%'
                            justify='space-around'
                            align='center'
                        >
                            <StyledSpan size='1rem' width='100%'
                                content={lastname}
                            />
                            <Button
                                height='2rem'
                                content='Изменить'
                                background='grey'
                                padding='0.5rem'
                                margin='0 0 0 3.5rem'
                                handleSubmit={() => { setLastnameEditMode(true) }}
                            />
                        </Flex>
                    )

            }
        </Flex>
    )
}