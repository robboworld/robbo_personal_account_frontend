import React from 'react'

import { SidebarIcon } from '@/components/AccountShell'

export const getSidebarIconAccent = item => {
  if (item.iconAccent) {
    return item.iconAccent
  }
  if (item.external === 'lms') {
    return 'green'
  }
  if (item.key === 'send_notification') {
    return 'green'
  }
  return 'rose'
}

export const withSidebarIcon = (item, collapsed = false) => {
  if (!item?.icon || item.type === 'divider') {
    return item
  }

  const accent = getSidebarIconAccent(item)

  if (collapsed) {
    return {
      ...item,
      'data-icon-accent': accent,
      icon: item.icon,
    }
  }

  return {
    ...item,
    icon: (
      <SidebarIcon $accent={accent}>
        {item.icon}
      </SidebarIcon>
    ),
  }
}

export const mapSidebarMenuItems = (items, collapsed = false) => (
  (items || []).map(item => withSidebarIcon(item, collapsed))
)
