import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'

import SideBar from '@/components/SideBar'
import SelectLanguage from '@/components/SelectLanguage'
import NotificationBell from '@/components/NotificationBell/NotificationBell'
import { parseJwt, getSelectedNavBarKeyFromPath } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'
import theme from '@/theme'

const { Header, Sider, Content } = Layout
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'lk_sidebar_collapsed'

const PageLayout = ({ children }) => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true')

    const selectedNavBarKey = useMemo(() => {
        const fromState = location.state?.selectedNavBarKey
        if (fromState != null && fromState !== '') {
            return fromState
        }
        if (location.pathname === HOME_PAGE_ROUTE) {
            return 'home'
        }
        let role
        try {
            const token = localStorage.getItem('token')
            if (token) {
                role = parseJwt(token).Role
            }
        } catch (_) {
            /* ignore */
        }
        return getSelectedNavBarKeyFromPath(role, location.pathname)
    }, [location.pathname, location.state])

    useEffect(() => {
        localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed))
    }, [collapsed])
    return (
        <Layout>
            <Sider
                trigger={null} collapsible
                collapsed={collapsed} theme='light'
            >
                <SideBar selectedNavBarKey={selectedNavBarKey} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        backgroundColor: theme.colors.accentGreen,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        lineHeight: 1,
                    }}
                >
                    <div style={{ flexShrink: 0 }}>
                        {
                            React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })
                        }
                    </div>
                    <div
                        style={{
                            marginLeft: 'auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 12,
                            flexShrink: 0,
                        }}
                    >
                        <SelectLanguage />
                        <NotificationBell />
                    </div>
                </Header>
                <Content style={{ padding: '0 1rem', background: '#f4f8f4' }}>
                    {
                        children
                    }
                </Content>
            </Layout>
        </Layout >
    )
}

export default PageLayout