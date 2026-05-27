import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

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

const AuthLayout = ({ activeTab, children }) => {
  const navigate = useNavigate()

  return (
    <AuthShell className='robbo-auth-standalone-shell'>
      <AuthMain id='main'>
        <AuthLayoutGrid className='layout'>
          <HeroColumn className='w-50 d-flex'>
            <HeroLogoLink href={LANDING_PAGE_ROUTE} aria-label='РОББО'>
              <img alt='РОББО' src='/static/logo.png' />
            </HeroLogoLink>
            <HeroTitle className='display-2'>
              <HeroTitleLine className='auth-hero-title-line'>
                Начни обучение
              </HeroTitleLine>
              <HeroBrandLine className='auth-hero-brand-line text-accent-a'>
                с РОББО
              </HeroBrandLine>
            </HeroTitle>
          </HeroColumn>

          <ContentColumn className='content'>
            <ContentPanel>
              <AuthFormWrap className='authn-logistration'>
                <div className='authn-logistration__inner'>
                  <AuthTabs role='tablist' aria-label='Вход и регистрация'>
                    <AuthTabLink
                      role='tab'
                      $active={activeTab === 'register'}
                      aria-selected={activeTab === 'register'}
                      href={REGISTER_PAGE_ROUTE}
                      onClick={event => {
                        event.preventDefault()
                        navigate(REGISTER_PAGE_ROUTE)
                      }}
                    >
                      Регистрация
                    </AuthTabLink>
                    <AuthTabLink
                      role='tab'
                      $active={activeTab === 'login'}
                      aria-selected={activeTab === 'login'}
                      href={LOGIN_PAGE_ROUTE}
                      onClick={event => {
                        event.preventDefault()
                        navigate(LOGIN_PAGE_ROUTE)
                      }}
                    >
                      Вход
                    </AuthTabLink>
                  </AuthTabs>

                  <MainContent id='main-content' className='main-content'>
                    {children}
                  </MainContent>

                  <AuthFooterLinks>
                    <AuthTextLink type='button' onClick={() => navigate(LANDING_PAGE_ROUTE)}>
                      Вернуться на лэндинг
                    </AuthTextLink>
                  </AuthFooterLinks>
                </div>
              </AuthFormWrap>
            </ContentPanel>
          </ContentColumn>
        </AuthLayoutGrid>
      </AuthMain>
    </AuthShell>
  )
}

AuthLayout.propTypes = {
  activeTab: PropTypes.oneOf(['login', 'register']).isRequired,
  children: PropTypes.node.isRequired,
}

export default AuthLayout
