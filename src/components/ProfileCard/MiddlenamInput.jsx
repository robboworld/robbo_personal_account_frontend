import React, { useState } from "react"

import Flex from '@/components/Flex'
import { Button, Input, StyledSpan } from '@/components/UI'

export default ({
    token,
    profile,
    updateHandle,
}) => {

    const setMiddlenameHandler = middlename => {
        setMiddlename(middlename)
        profile.middlename = middlename
    }

    const [middlename, setMiddlename] = useState(profile.middlename)
    const [middlenameEditMode, setMiddlenameEditMode] = useState(false)

    return (
        <Flex
            width='100%'
            justify='space-between'
            margin='0 0 10px 0'
            align='center'
        >
            {
                middlenameEditMode
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
                                value={middlename}
                                handleInput={middlename => setMiddlenameHandler(middlename)}
                            />
                            <Button
                                content='Готово'
                                height='2rem'
                                padding='10px'
                                background='green'
                                margin='0 0 0 10px'
                                handleSubmit={() => {
                                    setMiddlenameEditMode(false)
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
                                content={middlename}
                            />
                            <Button
                                height='2rem'
                                content='Изменить'
                                background='grey'
                                padding='0.5rem'
                                margin='0 0 0 3.5rem'
                                handleSubmit={() => { setMiddlenameEditMode(true) }}
                            />
                        </Flex>
                    )

            }
        </Flex>
    )
}