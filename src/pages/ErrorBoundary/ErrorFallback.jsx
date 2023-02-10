import React from "react"
import { Typography } from "antd"
import { FormattedMessage } from "react-intl"

import { Code } from './components'

import PageLayout from '@/components/PageLayout'
import Flex from "@/components/Flex"

const { Title } = Typography

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
                <Title>
                    <FormattedMessage id='error_fallback.title' />
                </Title>
            </Flex>
        </PageLayout >
    )
}