import React, { useEffect, useState } from 'react'
import { Col, Layout, Row } from 'antd'
import { useLocation } from 'react-router-dom'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'

import SideBar from '@/components/SideBar'
import SelectLanguage from '@/components/SelectLanguage'
import { HOME_PAGE_ROUTE } from '@/constants'

const { Header, Sider, Content } = Layout
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'lk_sidebar_collapsed'

const PageLayout = ({ children }) => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true')

    useEffect(() => {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed))
    }, [collapsed])
    return (
        <Layout>
            <Sider
                trigger={null} collapsible
                collapsed={collapsed} theme='light'
            >
                <SideBar selectedNavBarKey={location.state?.selectedNavBarKey || (location.pathname === HOME_PAGE_ROUTE ? 'home' : undefined)} />
            </Sider>
            <Layout>
                <Header style={{ backgroundColor: '#00af41' }}>
                    <Row justify='space-between' align='middle'>
                        <Col span={12}>
                            {
                                React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: () => setCollapsed(!collapsed),
                                })
                            }
                        </Col>
                        <Col span={12}>
                            <SelectLanguage />
                        </Col>
                    </Row>

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