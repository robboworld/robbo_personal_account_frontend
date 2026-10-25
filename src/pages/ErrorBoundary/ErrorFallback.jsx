import React from 'react'
import { Button, Space, Typography } from 'antd'
import { FormattedMessage } from 'react-intl'

import { Code } from './components'

import Flex from '@/components/Flex'
import { HOME_PAGE_ROUTE } from '@/constants'

const { Title, Paragraph } = Typography

// Rendered outside the router when the app crashed: plain navigation only.
export default () => {
  return (
    <Flex justify='center' align='center' height='100%' direction='column'>
      <Code>🤖</Code>
      <Title>
        <FormattedMessage id='error_fallback.title' />
      </Title>
      <Paragraph type='secondary'>
        <FormattedMessage id='error_fallback.hint' />
      </Paragraph>
      <Space wrap>
        <Button type='primary' onClick={() => window.location.reload()}>
          <FormattedMessage id='error_fallback.reload' />
        </Button>
        <Button onClick={() => window.location.assign(HOME_PAGE_ROUTE)}>
          <FormattedMessage id='error_fallback.home' />
        </Button>
      </Space>
    </Flex>
  )
}
