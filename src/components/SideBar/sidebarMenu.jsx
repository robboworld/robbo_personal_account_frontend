import React from 'react'

import { SidebarIcon } from '@/components/AccountShell'
import { LOGIN_PAGE_ROUTE } from '@/constants'

export const getSidebarIconAccent = item => {
  if (item.iconAccent) {
    return item.iconAccent
  }
  if (item.external === 'lms') {
    return 'green'
  }
  if (item.pathname === LOGIN_PAGE_ROUTE) {
    return 'muted'
  }
  if (item.key === 'send_notification') {
    return 'green'
  }
  return 'rose'
}

export const withSidebarIcon = item => {
  if (!item?.icon) {
    return item
  }

  const accent = getSidebarIconAccent(item)
  const isLogout = item.pathname === LOGIN_PAGE_ROUTE

  return {
    ...item,
    'data-menu-logout': isLogout ? 'true' : undefined,
    icon: (
      <SidebarIcon $accent={accent}>
        {item.icon}
      </SidebarIcon>
    ),
  }
}

export const mapSidebarMenuItems = items => (items || []).map(withSidebarIcon)
