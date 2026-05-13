import React from 'react'
import { Layout, Tabs, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'

import SignInForm from '@/components/SignInForm'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import { LANDING_PAGE_ROUTE, REGISTER_PAGE_ROUTE } from '@/constants'
import theme from '@/theme'

const { Content } = Layout

const PageLayoutLogin = () => {
    const intl = useIntl()
    const navigate = useNavigate()
    const actions = useActions({ signInRequest, signUpRequest }, [])
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
        </Layout >
    )
}

export default PageLayoutLogin