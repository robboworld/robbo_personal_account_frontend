import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { Input, Button } from '@/components/UI'
import Flex from '@/components/Flex'

export default memo(({
    margin, handleSubmit,
    buttonOption,
}) => {

    const [name, setName] = useState('')
    const [city, setCity] = useState('')


    return (
        <Flex
            direction='column' justify='space-around'
            align='center' width='100%'
        >
            <Input type='text' placeholder='Название'
                value={name} handleInput={name => setName(name)}
                margin={margin}
            />
            <Input type='password' placeholder='Город'
                value={city} handleInput={city => setCity(city)}
                margin={margin}
            />

            <Flex
                justify='center' align='center'
                width='100%' margin='1rem 0 2rem 0'
            >
                <Button
                    content={buttonOption.content}
                    handleSubmit={
                        () => handleSubmit({
                            name, city,
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