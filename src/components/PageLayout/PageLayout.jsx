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
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import HeaderExploreNav from '@/components/PageLayout/HeaderExploreNav'
import { parseJwt, getSelectedNavBarKeyFromPath } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'
import theme from '@/theme'
import robboGuestTokens from '@/theme/robboGuestTokens'

const { Header, Sider, Content } = Layout
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'lk_sidebar_collapsed'

const shellStyle = {
    minHeight: '100dvh',
}

const innerLayoutStyle = {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
}

const contentStyle = {
    flex: 1,
    padding: '0 1rem',
    background: robboGuestTokens.lkPageBg,
}

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
        <Layout style={shellStyle}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme='light'
                width={232}
                collapsedWidth={80}
                styles={{ body: { overflow: 'hidden', padding: 0 } }}
            >
                <SideBar selectedNavBarKey={selectedNavBarKey} collapsed={collapsed} />
            </Sider>
            <Layout style={innerLayoutStyle}>
                <Header
                    style={{
                        backgroundColor: theme.colors.accentGreen,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        lineHeight: 1,
                        flexShrink: 0,
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
                    <HeaderExploreNav />
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
                <Content style={contentStyle}>
                    {children}
                </Content>
                <RobboSiteFooter />
            </Layout>
        </Layout>
    )
}

export default PageLayout
