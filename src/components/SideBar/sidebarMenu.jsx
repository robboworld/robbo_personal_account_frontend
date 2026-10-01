import React from 'react'

import { SidebarIcon } from '@/components/AccountShell'

export const getSidebarIconAccent = item => {
  if (item.iconAccent) {
    return item.iconAccent
  }
  if (item.external === 'lms' || item.external === 'scratch') {
    return 'green'
  }
  if (item.key === 'send_notification') {
    return 'green'
  }
  if (item.key === 'my_licenses') {
    return 'green'
  }
  return 'rose'
}

export const withSidebarIcon = (item, collapsed = false) => {
  if (!item?.icon || item.type === 'divider') {
    return item
  }

  const accent = getSidebarIconAccent(item)
  // antd 6 passes unknown item fields to the <li>: keep routing data out of the DOM
  // (clicks resolve the entry by key in SideBar).
  const { iconAccent, pathname, external, ...menuItem } = item

  return {
    ...menuItem,
    'data-icon-accent': accent,
    icon: (
      <SidebarIcon $accent={accent} $collapsed={collapsed}>
        {item.icon}
      </SidebarIcon>
    ),
  }
}

export const mapSidebarMenuItems = (items, collapsed = false) => (
  (items || []).map(item => withSidebarIcon(item, collapsed))
)
