import React from 'react'

import { StyledListItem } from './components'

import Flex from '@/components/Flex'


export default ({
    label,
    handleClick,
}) => {
    return (
        <Flex>
            <StyledListItem>
                {label}
            </StyledListItem>
        </Flex>
    )
}