import React from 'react'
import styled from 'styled-components'

import LoginStreakBadge from '@/components/LoginStreakBadge/LoginStreakBadge'
import { SidebarIcon } from '@/components/AccountShell'
import { PROFILE_PAGE_ROUTE } from '@/constants'

const ProfileLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  min-width: 0;
`

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
  if (item.key === 'my_licenses') {
    return 'green'
  }
  return 'rose'
}

const withProfileStreakLabel = (item, loginStreak, collapsed) => {
  if (!item || item.pathname !== PROFILE_PAGE_ROUTE || collapsed) {
    return item
  }
  return {
    ...item,
    label: (
      <ProfileLabel>
        {item.label}
        <LoginStreakBadge
          current={loginStreak?.current}
          longest={loginStreak?.longest}
        />
      </ProfileLabel>
    ),
  }
}

export const withSidebarIcon = (item, collapsed = false) => {
  if (!item?.icon || item.type === 'divider') {
    return item
  }

  const accent = getSidebarIconAccent(item)

  return {
    ...item,
    'data-icon-accent': accent,
    icon: (
      <SidebarIcon $accent={accent} $collapsed={collapsed}>
        {item.icon}
      </SidebarIcon>
    ),
  }
}

export const mapSidebarMenuItems = (items, collapsed = false, loginStreak = null) => (
  (items || []).map(item => withSidebarIcon(
    withProfileStreakLabel(item, loginStreak, collapsed),
    collapsed,
  ))
)
