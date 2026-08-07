import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, Layout } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'

import SideBar from '@/components/SideBar'
import RobboSiteFooter from '@/components/RobboSiteFooter/RobboSiteFooter'
import SelectLanguage from '@/components/SelectLanguage'
import NotificationBell from '@/components/NotificationBell/NotificationBell'
import {
  MobileBrandLabel,
  MobileMenuBtn,
  MobileTopBar,
  MobileTopBarActions,
  MobileTopBarBrand,
} from '@/components/AccountShell'
import { parseJwt, getSelectedNavBarKeyFromPath, useIsLkMobile } from '@/helpers'
import { HOME_PAGE_ROUTE } from '@/constants'
import robboGuestTokens from '@/theme/robboGuestTokens'

const { Sider, Content } = Layout
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'lk_sidebar_collapsed'

const shellStyle = {
  flex: 1,
  minHeight: 0,
  width: '100%',
  maxWidth: '100%',
  overflowX: 'clip',
}

const innerLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
}

const PageLayout = ({ children }) => {
  const location = useLocation()
  const intl = useIntl()
  const isMobile = useIsLkMobile()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true',
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
    if (!isMobile) {
      localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed))
    }
  }, [collapsed, isMobile])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobile) {
      setMobileNavOpen(false)
    }
  }, [isMobile])

  const contentStyle = {
    flex: 1,
    padding: isMobile ? '0' : '0 1rem',
    background: robboGuestTokens.lkPageBg,
    minWidth: 0,
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'clip',
      }}
    >
      {isMobile && (
        <MobileTopBar>
          <MobileTopBarBrand>
            <MobileMenuBtn
              type='button'
              aria-label={intl.formatMessage({ id: 'sidebar.open_menu' })}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <MenuOutlined />
            </MobileMenuBtn>
            <MobileBrandLabel>
              <FormattedMessage id='footer.brand' />
            </MobileBrandLabel>
          </MobileTopBarBrand>
          <MobileTopBarActions>
            <SelectLanguage variant='sidebar' />
            <NotificationBell variant='sidebar' />
          </MobileTopBarActions>
        </MobileTopBar>
      )}

      <Layout style={shellStyle}>
        {!isMobile && (
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
        )}

        <Layout style={innerLayoutStyle}>
          <Content style={contentStyle}>
            {children}
          </Content>
        </Layout>
      </Layout>

      <Drawer
        placement='left'
        open={isMobile && mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        width='min(100vw - 1rem, 24rem)'
        closable={false}
        destroyOnClose={false}
        className='lk-mobile-nav-drawer'
        styles={{
          body: {
            padding: 0,
            margin: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: robboGuestTokens.lkPageBg,
            border: 'none',
          },
          content: {
            padding: 0,
            border: 'none',
            boxShadow: '2px 0 16px rgba(56, 56, 56, 0.12)',
          },
          wrapper: {
            maxWidth: '100vw',
          },
        }}
      >
        <SideBar
          variant='drawer'
          selectedNavBarKey={selectedNavBarKey}
          collapsed={false}
          onNavigate={() => setMobileNavOpen(false)}
          onCloseDrawer={() => setMobileNavOpen(false)}
        />
      </Drawer>

      <RobboSiteFooter />
    </div>
  )
}

export default PageLayout
