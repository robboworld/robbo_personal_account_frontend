import React, { useEffect, useMemo } from 'react'
import { useMutation } from '@apollo/client/react'
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
  lockForKidAccount,
} from './SideBarData.jsx'
import { mapSidebarMenuItems } from './sidebarMenu'
import SidebarUserInfo from './SidebarUser'

import { checkAuthRequest, signOutSuccess } from '@/actions/auth'
import { authMutationsGQL, graphQLClient } from '@/graphQL/index.js'
import {
  openLms,
  clearLmsIdentityLink,
  buildPostLogoutUrl,
  isOidcSsoEnabled,
  redirectToOidcLogoutLK,
  useAuthRole,
} from '@/helpers'
import { broadcastAuthLogout } from '@/helpers/authEcosystemSync'
import { getKidSession } from '@/helpers/kidSession'
import { KID_HIDDEN_NAV_KEYS, KID_LOCKED_NAV_KEYS, useIsKidAccount } from '@/helpers/kidAccount'
import { redirectToOidcLogout } from '@/helpers/oidcSession'
import { useCurrentUser } from '@/helpers/useAuthRole'
import {
  CLASSES_ROLES,
  CLASSES_ROUTES,
  FILES_ROLES,
  FULL_ACCOUNT_ROUTE,
  LOGIN_PAGE_ROUTE,
  MY_FILES_ROUTE,
} from '@/constants'
import { FullAccountSidebarCta } from '@/components/FullAccount'
import SelectLanguage from '@/components/SelectLanguage'
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
import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'
import { useLegacyAdminEnabled, withoutLegacyAdminItems } from '@/helpers/legacyAdminSection'

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
  const currentUserId = useCurrentUser().id
  const isKid = useIsKidAccount()
  const isDrawer = variant === 'drawer'
  const menuCollapsed = isDrawer ? false : collapsed

  // The project page mounts its own layout, so the sidebar remounts on the way there: a
  // session this tab already verified needs no second check-auth round trip.
  const sessionChecked = useSelector(({ login }) => Boolean(login.isAuth && login.userId))
  useEffect(() => {
    if (sessionChecked) {
      return
    }
    dispatch(checkAuthRequest(getAccessToken() || null))
    // Mount-time decision only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const visibleRoleSideBarData = useMemo(
    () =>
      roleSideBarData.filter(
        item =>
          (CLASSES_ROLES.includes(Role) || !CLASSES_ROUTES.includes(item.pathname)) &&
          (FILES_ROLES.includes(Role) || item.pathname !== MY_FILES_ROUTE),
      ),
    [Role, roleSideBarData],
  )

  const legacyAdminEnabled = useLegacyAdminEnabled()
  const SideBarData = useMemo(() => {
    const items = withSharedExploreItems(
      withoutLegacyAdminItems(visibleRoleSideBarData, legacyAdminEnabled),
    )
    return isKid
      ? lockForKidAccount(items, {
          lockedKeys: KID_LOCKED_NAV_KEYS,
          hiddenKeys: KID_HIDDEN_NAV_KEYS,
          fullAccountPath: FULL_ACCOUNT_ROUTE,
        })
      : items
  }, [visibleRoleSideBarData, legacyAdminEnabled, isKid])

  const flatSideBarData = useMemo(() => flattenSidebarItems(SideBarData), [SideBarData])

  const menuItems = useMemo(
    () => mapSidebarMenuItems(SideBarData, menuCollapsed),
    [SideBarData, menuCollapsed],
  )

  const [singOutMutation] = useMutation(authMutationsGQL.SING_OUT)

  const clearLocalSession = () => {
    dispatch(signOutSuccess())
    graphQLClient.resetStore()
    clearAccessToken()
    clearLmsIdentityLink()
  }

  const handleLogout = async () => {
    // OIDC BFF: clear BFF cookie + LMS session, then return to landing.
    if (isOidcSsoEnabled()) {
      clearLocalSession()
      broadcastAuthLogout()
      // A child of the class sign-in has no LMS session: straight back to the class page,
      // where the next child signs in on this computer.
      const kidPage = getKidSession(currentUserId)?.classPage
      if (kidPage) {
        redirectToOidcLogout(kidPage, { skipIdp: true })
        return
      }
      redirectToOidcLogoutLK()
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
            {/* Language and notifications live in the mobile top bar: a second bell here would poll twice. */}
            <SidebarCollapseBtn
              type='button'
              $collapsed={false}
              $drawer
              aria-label={intl.formatMessage({ id: 'sidebar.close_menu' })}
              onClick={onCloseDrawer}>
              <CloseOutlined />
            </SidebarCollapseBtn>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SidebarCollapseBtn
              type='button'
              $collapsed={collapsed}
              aria-label={
                collapsed
                  ? intl.formatMessage({ id: 'sidebar.expand' })
                  : intl.formatMessage({ id: 'sidebar.collapse' })
              }
              onClick={onToggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </SidebarCollapseBtn>
            {/* Notifications: on the right, over the page (PageLayout). */}
            <SidebarTopActions $collapsed={collapsed}>
              <SelectLanguage variant='sidebar' />
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
        {isKid && (
          <FullAccountSidebarCta
            collapsed={menuCollapsed}
            onClick={() => {
              navigate(FULL_ACCOUNT_ROUTE)
              if (onNavigate) {
                onNavigate()
              }
            }}
          />
        )}
        <SidebarUserInfo role={Role} collapsed={menuCollapsed} skip={!sessionChecked} />
        <SidebarLogoutBtn type='button' $collapsed={menuCollapsed} onClick={() => handleLogout()}>
          <LogoutOutlined />
          <span>
            <FormattedMessage id='sidebar_data.logout' />
          </span>
        </SidebarLogoutBtn>
      </SidebarFooter>
    </SidebarShell>
  )
}
