import React, { useEffect, useMemo } from 'react'
import { useMutation } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CloseOutlined,
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
  flattenSidebarItems,
} from './SideBarData.jsx'
import { mapSidebarMenuItems } from './sidebarMenu'

import { checkAuthRequest, signOutSuccess } from '@/actions/auth'
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
  LANDING_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
} from '@/constants'
import SelectLanguage from '@/components/SelectLanguage'
import NotificationBell from '@/components/NotificationBell/NotificationBell'
import { getLoginStreak } from '@/reducers/login'
import {
  SidebarMenu,
  SidebarShell,
  SidebarTopBar,
  SidebarTopActions,
  SidebarCollapseBtn,
  SidebarFooter,
  SidebarLogoutBtn,
  SidebarBrand,
} from '@/components/AccountShell'

/** Build nav: primary → tools / tariffs / rest, with dividers. */
const withSharedExploreItems = roleItems => buildSidebarItems(roleItems)

export default ({
  selectedNavBarKey = '1',
  collapsed = false,
  onToggleCollapsed,
  variant = 'desktop',
  onNavigate,
  onCloseDrawer,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const Role = useAuthRole()
  const loginStreak = useSelector(({ login }) => getLoginStreak(login))
  const isDrawer = variant === 'drawer'
  const menuCollapsed = isDrawer ? false : collapsed

  useEffect(() => {
    dispatch(checkAuthRequest(localStorage.getItem('token') || null))
  }, [dispatch])

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

  const flatSideBarData = useMemo(
    () => flattenSidebarItems(SideBarData),
    [SideBarData],
  )

  const menuItems = useMemo(
    () => mapSidebarMenuItems(SideBarData, menuCollapsed, loginStreak),
    [SideBarData, menuCollapsed, loginStreak],
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
      redirectToOidcLogout(`${LANDING_PAGE_ROUTE}?logged_out=1`)
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
    const entry = flatSideBarData.find(i => String(i.key) === String(key))
    if (!entry) {
      return
    }
    if (entry.external === 'lms') {
      if (onNavigate) {
        onNavigate()
      }
      await openLms()
      return
    }
    navigate(entry.pathname, { state: { selectedNavBarKey: key } })
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <SidebarShell $collapsed={menuCollapsed} $drawer={isDrawer}>
      <SidebarTopBar $collapsed={menuCollapsed} $drawer={isDrawer}>
        {isDrawer ? (
          <React.Fragment>
            <SidebarBrand>
              <FormattedMessage id='footer.brand' />
            </SidebarBrand>
            <SidebarTopActions $drawer>
              <SelectLanguage variant='sidebar' />
              <NotificationBell variant='sidebar' />
            </SidebarTopActions>
            <SidebarCollapseBtn
              type='button'
              $collapsed={false}
              $drawer
              aria-label={intl.formatMessage({ id: 'sidebar.close_menu' })}
              onClick={onCloseDrawer}
            >
              <CloseOutlined />
            </SidebarCollapseBtn>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SidebarCollapseBtn
              type='button'
              $collapsed={collapsed}
              aria-label={collapsed
                ? intl.formatMessage({ id: 'sidebar.expand' })
                : intl.formatMessage({ id: 'sidebar.collapse' })}
              onClick={onToggleCollapsed}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </SidebarCollapseBtn>
            <SidebarTopActions $collapsed={collapsed}>
              <SelectLanguage variant='sidebar' />
              <NotificationBell variant='sidebar' />
            </SidebarTopActions>
          </React.Fragment>
        )}
      </SidebarTopBar>
      <SidebarMenu
        theme='light'
        mode='inline'
        inlineCollapsed={menuCollapsed}
        inlineIndent={isDrawer ? 0 : 24}
        $collapsed={menuCollapsed}
        $drawer={isDrawer}
        selectedKeys={[selectedNavBarKey]}
        onClick={onMenuClick}
        items={menuItems}
      />
      <SidebarFooter $collapsed={menuCollapsed}>
        <SidebarLogoutBtn
          type='button'
          $collapsed={menuCollapsed}
          onClick={() => handleLogout()}
        >
          <LogoutOutlined />
          <span><FormattedMessage id='sidebar_data.logout' /></span>
        </SidebarLogoutBtn>
      </SidebarFooter>
    </SidebarShell>
  )
}
