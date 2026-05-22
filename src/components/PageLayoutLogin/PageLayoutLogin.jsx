import React from 'react'
import { Layout, Tabs, Button, Divider, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'

import SignInForm from '@/components/SignInForm'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import { HOME_PAGE_ROUTE, LANDING_PAGE_ROUTE, REGISTER_PAGE_ROUTE } from '@/constants'
import { redirectToOidcStart } from '@/helpers/oidcSession'
import theme from '@/theme'

const { Content } = Layout
const { Text } = Typography

const PageLayoutLogin = ({ showOidcLogin = false, hybridAuth = false }) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const actions = useActions({ signInRequest, signUpRequest }, [])

  const handleOidcLogin = () => {
    redirectToOidcStart(HOME_PAGE_ROUTE, 'login')
  }

  return (
    <Layout
      style={{
        background: `linear-gradient(to bottom, ${theme.colors.accentGreen}, #f0fff0)`,
        margin: '5rem 10rem',
      }}
    >
      <Content style={{ display: 'flex', justifyContent: 'center', background: 'white', padding: '5rem 10rem' }}>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            <Button type='link' onClick={() => navigate(LANDING_PAGE_ROUTE)}>
              Назад на лэндинг
            </Button>
            <Button type='link' onClick={() => navigate(REGISTER_PAGE_ROUTE)}>
              Зарегистрироваться
            </Button>
          </div>

          {showOidcLogin && (
            <React.Fragment>
              <Button type='primary' size='large'
block onClick={handleOidcLogin}
style={{ marginBottom: 16 }}>
                Войти через LMS (OAuth)
              </Button>
              {hybridAuth && (
                <React.Fragment>
                  <Divider plain>или</Divider>
                  <Text type='secondary' style={{ display: 'block', marginBottom: 12 }}>
                    Если OAuth недоступен — войдите email и паролем из LMS (данные из базы openedx).
                  </Text>
                </React.Fragment>
              )}
            </React.Fragment>
          )}

          <Tabs
            defaultActiveKey='1'
            items={[
              {
                label: intl.formatMessage({ id: 'login_page.title' }),
                key: '1',
                children: <SignInForm handleSubmit={user => actions.signInRequest(user)} />,
              },
            ]}
          />
        </div>
      </Content>
    </Layout>
  )
}

export default PageLayoutLogin
