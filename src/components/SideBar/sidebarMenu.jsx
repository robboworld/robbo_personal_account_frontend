import React from 'react'
import styled from 'styled-components'
import { LockOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'

import { SidebarIcon } from '@/components/AccountShell'

// A section a kid account opens with a full one: muted, with a lock after the name.
const LockedLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  opacity: 0.6;

  .sidebar-lock {
    font-size: 0.75rem;
    color: #b07800;
  }
`

const LockHint = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`

const lockedLabel = label => (
  <LockedLabel>
    {label}
    <LockOutlined className='sidebar-lock' aria-hidden />
    <LockHint>
      <FormattedMessage id='full_account.locked' />
    </LockHint>
  </LockedLabel>
)

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
  const { iconAccent, pathname, external, locked, ...menuItem } = item

  return {
    ...menuItem,
    ...(locked ? { label: lockedLabel(item.label), 'data-locked': 'true' } : {}),
    'data-icon-accent': accent,
    icon: (
      <SidebarIcon $accent={accent} $collapsed={collapsed}>
        {item.icon}
      </SidebarIcon>
    ),
  }
}

export const mapSidebarMenuItems = (items, collapsed = false) =>
  (items || []).map(item => withSidebarIcon(item, collapsed))
