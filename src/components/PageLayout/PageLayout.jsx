import React, { useState } from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'

import SideBar from '@/components/SideBar'

const { Header, Footer, Sider, Content } = Layout

const PageLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    return (
        <Layout>
            <Sider
                trigger={null} collapsible
                collapsed={collapsed} theme='light'
            >
                <SideBar />
            </Sider>
            <Layout>
                <Header style={{ backgroundColor: 'green' }}>
                    {
                        React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })
                    }
                </Header>
                <Content style={{ padding: '0 1rem' }}>
                    {
                        React.Children.map(children, child =>
                            <React.Fragment>{child}</React.Fragment>)
                    }
                </Content>
                {/* <Footer>Footer</Footer> */}
            </Layout>
        </Layout >
    )
}

export default PageLayout