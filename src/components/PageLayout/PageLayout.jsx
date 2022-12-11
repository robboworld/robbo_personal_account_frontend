import React, { useState } from 'react'
import { Layout } from 'antd'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'

import SideBar from '@/components/SideBar'

const { Header, Sider, Content } = Layout

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
                        children
                    }
                </Content>
            </Layout>
        </Layout >
    )
}

export default PageLayout