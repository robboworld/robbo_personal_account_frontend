import React from 'react'
import { Layout, Tabs } from 'antd'
import { useIntl } from 'react-intl'

import SignInForm from '@/components/SignInForm'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'

const { Content } = Layout

const PageLayoutLogin = () => {
    const intl = useIntl()
    const actions = useActions({ signInRequest, signUpRequest }, [])
    return (
        <Layout style={{ background: 'linear-gradient(to bottom, #008000, #f0fff0)', margin: '5rem 10rem' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', background: 'white', padding: '5rem 10rem' }}>
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
            </Content>
        </Layout >
    )
}

export default PageLayoutLogin