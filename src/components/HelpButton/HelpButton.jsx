import React from 'react'
import { Button } from 'antd'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const HelpLinkButton = styled(Button)`
  && {
    text-decoration: none;

    &:hover,
    &:focus,
    &:active,
    &:visited {
      text-decoration: none;
    }
  }
`

const HelpButton = () => {
  const intl = useIntl()

  return (
    <HelpLinkButton
      type='primary'
      href='https://support.robbo.world/'
      target='_blank'
      rel='noopener noreferrer'
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1000,
      }}
    >
      {intl.formatMessage({ id: 'header.help' })}
    </HelpLinkButton>
  )
}

export default HelpButton
