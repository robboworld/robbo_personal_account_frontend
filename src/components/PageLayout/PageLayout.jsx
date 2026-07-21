import React, { useEffect, useMemo, useState } from 'react'
import { Layout } from 'antd'
import { useLocation } from 'react-router-dom'

import SideBar from '@/components/SideBar'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import { parseJwt, getSelectedNavBarKeyFromPath } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'
import robboGuestTokens from '@/theme/robboGuestTokens'

const { Sider, Content } = Layout
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'lk_sidebar_collapsed'

const shellStyle = {
    flex: 1,
    minHeight: 0,
}

const innerLayoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
            <Layout style={shellStyle}>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme='light'
                    width={232}
                    collapsedWidth={80}
                    style={{
                        height: '100dvh',
                        maxHeight: '100dvh',
                        position: 'sticky',
                        top: 0,
                        flex: '0 0 auto',
                        zIndex: 20,
                        transition: [
                            'flex-basis 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                            'max-width 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                            'min-width 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                            'width 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                        ].join(', '),
                    }}
                    styles={{
                        body: {
                            overflow: 'hidden',
                            padding: 0,
                            height: '100%',
                            maxHeight: '100dvh',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                >
                    <SideBar
                        selectedNavBarKey={selectedNavBarKey}
                        collapsed={collapsed}
                        onToggleCollapsed={() => setCollapsed(prev => !prev)}
                    />
                </Sider>
                <Layout style={innerLayoutStyle}>
                    <Content style={contentStyle}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
            <RobboSiteFooter />
        </div>
    )
}

export default PageLayout
