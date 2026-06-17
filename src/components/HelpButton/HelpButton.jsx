import React, { useEffect } from 'react'
import { Button } from 'antd'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'
import styled from 'styled-components'

import { LANDING_PAGE_ROUTE } from '@/constants'
import { useLandingTheme } from '@/helpers/landingTheme'

const FloatingBar = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
`

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

const ThemeButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const HelpButton = () => {
  const intl = useIntl()
  const location = useLocation()
  const isLanding = location.pathname === LANDING_PAGE_ROUTE
  const { dark, toggleTheme } = useLandingTheme()

  useEffect(() => {
    if (!isLanding) {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isLanding])

  return (
    <FloatingBar>
      {isLanding ? (
        <ThemeButton
          type='default'
          onClick={toggleTheme}
          aria-label={intl.formatMessage({
            id: dark ? 'header.theme_light' : 'header.theme_dark',
          })}
        >
          {dark ? <FaSun size={14} aria-hidden /> : <FaMoon size={14} aria-hidden />}
          {intl.formatMessage({
            id: dark ? 'header.theme_light' : 'header.theme_dark',
          })}
        </ThemeButton>
      ) : null}
      <HelpLinkButton
        type='primary'
        href='https://support.robbo.world/'
        target='_blank'
        rel='noopener noreferrer'
      >
        {intl.formatMessage({ id: 'header.help' })}
      </HelpLinkButton>
    </FloatingBar>
  )
}

export default HelpButton
