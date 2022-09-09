import React from "react"
import { useSelector } from "react-redux"
import { Redirect } from "react-router-dom"

import { getIsAuth } from "@/reducers/login"

import Flex from "@/components/Flex"
import { StyledSpan } from "@/components/UI"
import { useUserIdentity } from "@/helpers"

export default ({ robboUnit }) => {
    useUserIdentity()
    const isAuth = useSelector(({ login }) => getIsAuth(login))
    if (!isAuth) {
        return <Redirect to='/login' />
    }
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