import React, { memo, useState } from 'react'

import { Input, Button } from '@/components/UI'
import Flex from '@/components/Flex'

export default memo(({
    margin, handleSubmit,
    buttonOption,
}) => {

    const [name, setName] = useState('')


    return (
        <Flex
            direction='column' justify='space-around'
            align='center' width='100%'
        >
            <Input type='text' placeholder='Название'
                value={name} handleInput={name => setName(name)}
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
                            name,
                        })}
                    padding={buttonOption.padding}
                />
            </Flex>
        </Flex>
    )
})
