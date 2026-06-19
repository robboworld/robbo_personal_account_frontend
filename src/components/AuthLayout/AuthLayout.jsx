import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import {
  AuthShell,
  AuthMain,
  AuthLayoutGrid,
  HeroColumn,
  HeroLogoLink,
  HeroTitle,
  HeroTitleLine,
  HeroBrandLine,
  ContentColumn,
  ContentPanel,
  AuthFormWrap,
  AuthFormInner,
  AuthTabs,
  AuthTabLink,
  MainContent,
  AuthFooterLinks,
  AuthTextLink,
} from './styles'

import {
  LANDING_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  REGISTER_PAGE_ROUTE,
} from '@/constants'

const AuthLayout = ({ selectedPage, onTabSelect, children }) => {
  const navigate = useNavigate()
  const intl = useIntl()

  const handleTabClick = (event, tabKey) => {
    event.preventDefault()
    onTabSelect(tabKey)
  }

  return (
    <AuthShell className='robbo-auth-standalone-shell'>
      <AuthMain id='main'>
        <AuthLayoutGrid className='layout'>
          <HeroColumn className='w-50 d-flex'>
            <HeroLogoLink
              href={LANDING_PAGE_ROUTE}
              aria-label={intl.formatMessage({ id: 'auth_layout.brand_aria' })}
            >
              <img
                alt={intl.formatMessage({ id: 'auth_layout.brand_aria' })}
                src='/static/logo.png'
              />
            </HeroLogoLink>
            <HeroTitle className='display-2'>
              <HeroTitleLine className='auth-hero-title-line'>
                <FormattedMessage id='auth_layout.hero_line_1' />
              </HeroTitleLine>
              <HeroBrandLine className='auth-hero-brand-line text-accent-a'>
                <FormattedMessage id='auth_layout.hero_line_2' />
              </HeroBrandLine>
            </HeroTitle>
          </HeroColumn>

          <ContentColumn className='content'>
            <ContentPanel>
              <AuthFormWrap className='authn-logistration'>
                <AuthFormInner className='authn-logistration__inner'>
                  <AuthTabs
                    role='tablist'
                    aria-label={intl.formatMessage({ id: 'auth_layout.tabs_aria' })}
                  >
                    <AuthTabLink
                      role='tab'
                      $active={selectedPage === REGISTER_PAGE_ROUTE}
                      aria-selected={selectedPage === REGISTER_PAGE_ROUTE}
                      href={REGISTER_PAGE_ROUTE}
                      onClick={event => handleTabClick(event, REGISTER_PAGE_ROUTE)}
                    >
                      <FormattedMessage id='auth_layout.tab_register' />
                    </AuthTabLink>
                    <AuthTabLink
                      role='tab'
                      $active={selectedPage === LOGIN_PAGE_ROUTE}
                      aria-selected={selectedPage === LOGIN_PAGE_ROUTE}
                      href={LOGIN_PAGE_ROUTE}
                      onClick={event => handleTabClick(event, LOGIN_PAGE_ROUTE)}
                    >
                      <FormattedMessage id='auth_layout.tab_login' />
                    </AuthTabLink>
                  </AuthTabs>

                  <MainContent id='main-content' className='main-content'>
                    {children}
                  </MainContent>

                  <AuthFooterLinks>
                    <AuthTextLink type='button' onClick={() => navigate(LANDING_PAGE_ROUTE)}>
                      <FormattedMessage id='auth_layout.back_to_landing' />
                    </AuthTextLink>
                  </AuthFooterLinks>
                </AuthFormInner>
              </AuthFormWrap>
            </ContentPanel>
          </ContentColumn>
        </AuthLayoutGrid>
      </AuthMain>
    </AuthShell>
  )
}

AuthLayout.propTypes = {
  selectedPage: PropTypes.oneOf([LOGIN_PAGE_ROUTE, REGISTER_PAGE_ROUTE]).isRequired,
  onTabSelect: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default AuthLayout
