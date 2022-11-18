import React from 'react'
import { Layout, Tabs } from 'antd'

import SignInForm from '@/components/SignInForm'
import SignUpForm from '@/components/SignUpForm'
import { useActions } from '@/helpers'

const { Content } = Layout

const PageLayoutLogin = () => {
    const { signInRequest, signUpRequest } = useActions()
    return (
        <Layout style={{ background: 'linear-gradient(to bottom, #008000, #f0fff0)', margin: '5rem 10rem' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', background: 'white', padding: '5rem 10rem' }}>
                <Tabs
                    defaultActiveKey='1'
                    items={[
                        {
                            label: `Войти`,
                            key: '1',
                            children: <SignInForm handleSubmit={user => signInRequest(user)} />,
                        },
                        {
                            label: `Регистрация`,
                            key: '2',
                            children: <SignUpForm handleSubmit={newUser => signUpRequest(newUser)} />,
                        },
                    ]}
                />
            </Content>
        </Layout >
    )
}

export default PageLayoutLogin