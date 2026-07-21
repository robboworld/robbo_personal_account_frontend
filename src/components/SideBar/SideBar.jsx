import React, { useMemo } from 'react'
import { Button, Space } from 'antd'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

import {
  SidebarDataSuperAdmin,
  SidebarDataStudent,
  SidebarDataParent,
  SidebarDataTeacher,
  SidebarDataUnitAdmin,
  SidebarDataFreeListener,
  buildSidebarItems,
} from './SideBarData.jsx'
import { mapSidebarMenuItems } from './sidebarMenu'

import { signOutSuccess } from '@/actions/auth'
import { authMutationsGQL, graphQLClient } from '@/graphQL/index.js'
import {
  openLms,
  clearLmsIdentityLink,
  buildPostLogoutUrl,
  isOidcSsoEnabled,
  redirectToOidcLogout,
  useAuthRole,
} from '@/helpers'
import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  SUPER_ADMIN,
  UNIT_ADMIN,
} from '@/constants'
import SelectLanguage from '@/components/SelectLanguage'
import NotificationBell from '@/components/NotificationBell/NotificationBell'
import {
  SidebarAdminActions,
  SidebarMenu,
  SidebarShell,
  SidebarTopBar,
  SidebarTopActions,
  SidebarCollapseBtn,
  SidebarFooter,
  SidebarLogoutBtn,
} from '@/components/AccountShell'

/** Build nav: Home / Profile / Projects / Explore — divider — Scratch / LMS — rest. */
const withSharedExploreItems = roleItems => buildSidebarItems(roleItems)

export default ({ selectedNavBarKey = '1', collapsed = false, onToggleCollapsed }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const Role = useAuthRole()

  const showAdminHomeShortcuts =
    location.pathname === HOME_PAGE_ROUTE && (Role === UNIT_ADMIN || Role === SUPER_ADMIN)

  const roleSideBarData = useMemo(() => {
    switch (Role) {
      case 0:
        return SidebarDataStudent
      case 1:
        return SidebarDataTeacher
      case 2:
        return SidebarDataParent
      case 3:
        return SidebarDataFreeListener
      case 4:
        return SidebarDataUnitAdmin
      case 5:
        return SidebarDataSuperAdmin
      default:
        return []
    }
  }, [Role])

  const SideBarData = useMemo(
    () => withSharedExploreItems(roleSideBarData),
    [roleSideBarData],
  )

  const menuItems = useMemo(
    () => mapSidebarMenuItems(SideBarData, collapsed),
    [SideBarData, collapsed],
  )

  const [singOutMutation] = useMutation(authMutationsGQL.SING_OUT)

  const clearLocalSession = () => {
    dispatch(signOutSuccess())
    graphQLClient.resetStore()
    localStorage.removeItem('token')
    clearLmsIdentityLink()
  }

  const handleLogout = async () => {
    // OIDC BFF: session lives in cookie — GraphQL SingOut alone cannot clear it.
    if (isOidcSsoEnabled()) {
      clearLocalSession()
      redirectToOidcLogout(LOGIN_PAGE_ROUTE)
      return
    }

    try {
      await singOutMutation()
    } catch {
      // Token may already be gone; still clear local state and leave.
    }
    clearLocalSession()

    const postLogoutUrl = buildPostLogoutUrl()
    if (postLogoutUrl) {
      window.location.assign(postLogoutUrl)
      return
    }
    navigate(LOGIN_PAGE_ROUTE)
  }

  const onMenuClick = async ({ key }) => {
    if (key === 'tools-divider') {
      return
    }
    const entry = SideBarData.find(i => String(i.key) === String(key))
    if (!entry || entry.type === 'divider') {
      return
    }
    if (entry.external === 'lms') {
      await openLms()
      return
    }
    navigate(entry.pathname, { state: { selectedNavBarKey: key } })
  }

  const onSendNotificationClick = () => {
    navigate(SEND_NOTIFICATION_ROUTE, { state: { selectedNavBarKey: 'send_notification' } })
  }

  return (
    <SidebarShell $collapsed={collapsed}>
      <SidebarTopBar $collapsed={collapsed}>
        <SidebarCollapseBtn
          type='button'
          $collapsed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapsed}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </SidebarCollapseBtn>
        <SidebarTopActions $collapsed={collapsed}>
          <SelectLanguage variant='sidebar' />
          <NotificationBell variant='sidebar' />
        </SidebarTopActions>
      </SidebarTopBar>
      {showAdminHomeShortcuts ? (
        <SidebarAdminActions>
          <Space direction='vertical' style={{ width: '100%' }}
size={8}>
            <Button type='primary' block
onClick={onSendNotificationClick}>
              <FormattedMessage id='sidebar_data.send_notification' />
            </Button>
          </Space>
        </SidebarAdminActions>
      ) : null}
      <SidebarMenu
        theme='light'
        mode='inline'
        inlineCollapsed={collapsed}
        $collapsed={collapsed}
        selectedKeys={[selectedNavBarKey]}
        onClick={onMenuClick}
        items={menuItems}
      />
      <SidebarFooter $collapsed={collapsed}>
        <SidebarLogoutBtn
          type='button'
          $collapsed={collapsed}
          onClick={() => handleLogout()}
        >
          <LogoutOutlined />
          {!collapsed ? (
            <span><FormattedMessage id='sidebar_data.logout' /></span>
          ) : null}
        </SidebarLogoutBtn>
      </SidebarFooter>
    </SidebarShell>
  )
}
