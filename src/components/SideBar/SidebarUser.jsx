import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client/react'

import { SidebarRoleIcon, SidebarUser, SidebarUserName } from '@/components/AccountShell'
import { USER_ROLE_MESSAGE_IDS } from '@/constants'
import { ROLE_ICONS } from '@/constants/roleIcons'
import { profileGQL } from '@/graphQL/query/profile'

/** Signed-in user's name and role icon; a free listener gets the name only. */
const SidebarUserInfo = ({ role, collapsed = false, skip = false }) => {
  const intl = useIntl()
  // Same query and cache entry as the home page and profile: no extra request once loaded.
  const { data } = useQuery(profileGQL.GET_USER, { fetchPolicy: 'cache-first', skip })
  const profile = data?.GetUser?.userHttp
  const name = (profile?.fullName || profile?.nickname || profile?.email || '').trim()
  const roleIcon = ROLE_ICONS[role]

  // Collapsed, a free listener would be an empty row.
  if (!name || (collapsed && !roleIcon)) {
    return null
  }

  const roleTitle = intl.formatMessage({ id: USER_ROLE_MESSAGE_IDS[role] || 'user_role.fallback' })

  return (
    <SidebarUser $collapsed={collapsed} data-testid='sidebar-user'>
      <SidebarUserName $collapsed={collapsed}>{name}</SidebarUserName>
      {roleIcon && (
        <Tooltip
          title={collapsed ? `${name} · ${roleTitle}` : roleTitle}
          placement={collapsed ? 'right' : 'top'}>
          <SidebarRoleIcon
            $accent={roleIcon.accent}
            role='img'
            aria-label={roleTitle}
            data-testid='sidebar-role-icon'>
            <roleIcon.Icon />
          </SidebarRoleIcon>
        </Tooltip>
      )}
    </SidebarUser>
  )
}

SidebarUserInfo.propTypes = {
  role: PropTypes.number,
  collapsed: PropTypes.bool,
  skip: PropTypes.bool,
}

export default SidebarUserInfo
