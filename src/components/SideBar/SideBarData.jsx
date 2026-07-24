import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  HomeOutlined,
  UserOutlined,
  ProjectOutlined,
  CreditCardOutlined,
  TeamOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  InfoCircleOutlined,
  BankOutlined,
  GroupOutlined,
  CodeOutlined,
  CompassOutlined,
  BookOutlined,
  KeyOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'

import {
  HOME_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  PROFILE_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  SCRATCH_HUB_ROUTE,
  PUBLIC_PROJECTS_ROUTE,
  MY_LICENSES_ROUTE,
  ISSUE_LICENSE_ROUTE,
} from '@/constants'

/** Explore — in the main nav block with home / profile / projects. */
export const ExploreNavItem = {
  key: 'public_projects',
  label: <FormattedMessage id='header.explore' />,
  pathname: PUBLIC_PROJECTS_ROUTE,
  icon: <CompassOutlined />,
}

/** External tools below the divider: Scratch.ru + LMS. */
export const ToolNavItems = [
  {
    key: 'scratch',
    label: <FormattedMessage id='sidebar_data.scratch_ru' />,
    pathname: SCRATCH_HUB_ROUTE,
    icon: <CodeOutlined />,
    iconAccent: 'green',
  },
  {
    key: 'lms',
    label: <FormattedMessage id='sidebar_data.lms' />,
    pathname: '#lms',
    external: 'lms',
    icon: <BookOutlined />,
    iconAccent: 'green',
  },
]

export const ToolsDividerItem = {
  type: 'divider',
  key: 'tools-divider',
  'data-menu-tools-divider': 'true',
}

/**
 * Order: Home → Profile → Projects (if any) → Explore → divider → Scratch → LMS → rest.
 */
export const buildSidebarItems = roleItems => {
  const head = []
  const tail = []

  ;(roleItems || []).forEach(item => {
    const isPrimary =
      item.key === 'home' ||
      item.pathname === PROFILE_PAGE_ROUTE ||
      item.pathname === MY_PROJECTS_ROUTE

    if (isPrimary) {
      head.push(item)
    } else {
      tail.push(item)
    }
  })

  return [
    ...head,
    ExploreNavItem,
    ToolsDividerItem,
    ...ToolNavItems,
    ...tail,
  ]
}

export const SidebarDataStudent = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.my_projects' />,
    pathname: MY_PROJECTS_ROUTE,
    icon: <ProjectOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
]

export const SidebarDataParent = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
]

export const SidebarDataSuperAdmin = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
  {
    key: 'issue_license',
    label: <FormattedMessage id='sidebar_data.issue_license' />,
    pathname: ISSUE_LICENSE_ROUTE,
    icon: <PlusCircleOutlined />,
  },
  {
    key: '5',
    label: <FormattedMessage id='sidebar_data.clients' />,
    pathname: CLIENTS_ROUTE,
    icon: <TeamOutlined />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.robbo_units' />,
    pathname: ROBBO_UNITS_ROUTE,
    icon: <BankOutlined />,
  }, {
    key: '7',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: '9',
    label: <FormattedMessage id='sidebar_data.unit_admins' />,
    pathname: UNIT_ADMINS_ROUTE,
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: '10',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <TeamOutlined />,
  },
  {
    key: 'send_notification',
    label: <FormattedMessage id='sidebar_data.send_notification' />,
    pathname: SEND_NOTIFICATION_ROUTE,
    icon: <NotificationOutlined />,
  },
]

export const SidebarDataTeacher = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
]

export const SidebarDataFreeListener = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.payments' />,
    pathname: '/program',
    icon: <CreditCardOutlined />,
  },
  {
    key: '3',
    label: <FormattedMessage id='sidebar_data.programm' />,
    pathname: '/program',
    icon: <ReadOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.informer' />,
    pathname: '/informer',
    icon: <InfoCircleOutlined />,
  },
]

export const SidebarDataUnitAdmin = [
  {
    key: 'home',
    label: <FormattedMessage id='sidebar_data.home' />,
    pathname: HOME_PAGE_ROUTE,
    icon: <HomeOutlined />,
  },
  {
    key: '1',
    label: <FormattedMessage id='sidebar_data.profile' />,
    pathname: PROFILE_PAGE_ROUTE,
    icon: <UserOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.robbo_units' />,
    pathname: ROBBO_UNITS_ROUTE,
    icon: <BankOutlined />,
  },
  {
    key: '4',
    label: <FormattedMessage id='sidebar_data.teachers' />,
    pathname: TEACHERS_PAGE_ROUTE,
    icon: <TeamOutlined />,
  },
  {
    key: '6',
    label: <FormattedMessage id='sidebar_data.robbo_groups' />,
    pathname: ROBBO_GROUPS_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: 'send_notification',
    label: <FormattedMessage id='sidebar_data.send_notification' />,
    pathname: SEND_NOTIFICATION_ROUTE,
    icon: <NotificationOutlined />,
  },
]
