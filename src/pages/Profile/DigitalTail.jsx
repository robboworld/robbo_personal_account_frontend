import React, { useEffect } from 'react'

import { DigitalTail, StyledSpan } from './components'

import Flex from '@/components/Flex'
import { useActions } from '@/helpers/useActions'

export default () => {
    useEffect(() => {
        // getDigitalTail()
    }, [])

    // const { } = useActions()

    return (
        <Flex
            direction='column'
            width='100%'
            margin='10px'
            justify='center'
            align='flrx-start'
        >
            <StyledSpan margin='0 0 10px 0'>Цифровой След</StyledSpan>
            <DigitalTail>
                DigitalTail
            </DigitalTail>
        </Flex>
    )
}