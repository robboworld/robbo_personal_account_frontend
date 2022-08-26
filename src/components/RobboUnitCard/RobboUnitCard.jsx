import React from "react"

import Flex from "@/components/Flex"
import { StyledSpan } from "@/components/UI"
import { useIsAuth } from "@/helpers"

export default ({ robboUnit }) => {
    useIsAuth()
    console.log(robboUnit)
    return (
        <Flex direction='column' margin='1rem'>
            <Flex>
                <StyledSpan
                    content='Название'
                    margin='0 10px 0 0'
                    size='1rem'
                />
                <StyledSpan
                    content={robboUnit.name}
                />
            </Flex>
            <Flex>
                <StyledSpan
                    content='Город'
                    margin='0 10px 0 0'
                    size='1rem'
                />
                <StyledSpan
                    content={robboUnit.city}
                />
            </Flex>
        </Flex>
    )
}