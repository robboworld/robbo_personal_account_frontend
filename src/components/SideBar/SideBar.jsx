import React, { useMemo } from 'react'
import { Button, Space } from 'antd'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  SidebarDataSuperAdmin,
  SidebarDataStudent,
  SidebarDataParent,
  SidebarDataTeacher,
  SidebarDataUnitAdmin,
  SidebarDataFreeListener,
} from './SideBarData.jsx'
import { mapSidebarMenuItems } from './sidebarMenu'

import { authMutationsGQL, graphQLClient } from '@/graphQL/index.js'
import { parseJwt, openLms, clearLmsIdentityLink, buildPostLogoutUrl } from '@/helpers'
import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  SUPER_ADMIN,
  UNIT_ADMIN,
} from '@/constants'
import { SidebarAdminActions, SidebarMenu, SidebarShell } from '@/components/AccountShell'

export default ({ selectedNavBarKey = '1' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const { Role } = parseJwt(token)
  const showAdminHomeShortcuts =
    location.pathname === HOME_PAGE_ROUTE && (Role === UNIT_ADMIN || Role === SUPER_ADMIN)
  let SideBarData = []
  switch (Role) {
    case 0: {
      SideBarData = SidebarDataStudent
      break
    }
    case 1: {
      SideBarData = SidebarDataTeacher
      break
    }
    case 2: {
      SideBarData = SidebarDataParent
      break
    }
    case 3: {
      SideBarData = SidebarDataFreeListener
      break
    }
    case 4: {
      SideBarData = SidebarDataUnitAdmin
      break
    }
    case 5: {
      SideBarData = SidebarDataSuperAdmin
      break
    }
  }

  const menuItems = useMemo(
    () => mapSidebarMenuItems(SideBarData),
    [SideBarData],
  )

  const [loginOut] = useMutation(authMutationsGQL.SING_OUT, {
    onCompleted: () => {
      graphQLClient.resetStore()
      localStorage.removeItem('token')
      clearLmsIdentityLink()

      const postLogoutUrl = buildPostLogoutUrl()
      if (postLogoutUrl) {
        window.location.assign(postLogoutUrl)
        return
      }

      navigate('/login')
    },
  })

  const onMenuClick = async ({ key }) => {
    const entry = SideBarData.find(i => String(i.key) === String(key))
    if (!entry) {
      return
    }
    if (entry.external === 'lms') {
      await openLms()
      return
    }
    if (entry.pathname === LOGIN_PAGE_ROUTE) {
      loginOut()
      return
    }
    navigate(entry.pathname, { state: { selectedNavBarKey: key } })
  }

  const onSendNotificationClick = () => {
    navigate(SEND_NOTIFICATION_ROUTE, { state: { selectedNavBarKey: 'send_notification' } })
  }

  return (
    <SidebarShell>
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
        selectedKeys={[selectedNavBarKey]}
        onClick={onMenuClick}
        items={menuItems}
      />
    </SidebarShell>
  )
}
