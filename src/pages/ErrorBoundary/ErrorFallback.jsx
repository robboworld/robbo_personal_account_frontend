import React from "react"

import { Title, Code } from './components'

import PageLayout from '@/components/PageLayout'

import Flex from "@/components/Flex"


export default () => {
    return (
        <PageLayout>
            <Flex
                justify='center'
                align='center'
                height='100%'
                direction='column'
            >
                <Code>🤖</Code>
                <Title>Что-то пошло не так</Title>
            </Flex>
        </PageLayout >
    )
}