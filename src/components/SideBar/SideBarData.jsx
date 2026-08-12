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
  BankOutlined,
  GroupOutlined,
  CodeOutlined,
  CompassOutlined,
  BookOutlined,
  KeyOutlined,
  PlusCircleOutlined,
  DesktopOutlined,
  StopOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'

import {
  HOME_PAGE_ROUTE,
  TEACHERS_PAGE_ROUTE,
  CLIENTS_ROUTE,
  UNIT_ADMINS_ROUTE,
  ROBBO_UNITS_ROUTE,
  PROFILE_PAGE_ROUTE,
  CUSTOMIZATION_PAGE_ROUTE,
  MY_PROJECTS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  USERS_ROUTE,
  SCRATCH_HUB_ROUTE,
  PUBLIC_PROJECTS_ROUTE,
  MY_LICENSES_ROUTE,
  MY_SESSIONS_ROUTE,
  ISSUE_LICENSE_ROUTE,
  TEACHER_CLASSES_ROUTE,
  STUDENT_CLASSES_ROUTE,
} from '@/constants'

/** Profile customization — avatar picker. */
export const CustomizationNavItem = {
  key: 'customization',
  label: <FormattedMessage id='sidebar_data.customization' />,
  pathname: CUSTOMIZATION_PAGE_ROUTE,
  icon: <BgColorsOutlined />,
}

/** Explore — in the main nav block with home / profile / projects. */
export const ExploreNavItem = {
  key: 'public_projects',
  label: <FormattedMessage id='header.explore' />,
  pathname: PUBLIC_PROJECTS_ROUTE,
  icon: <CompassOutlined />,
}

/** External tools: Scratch.ru + LMS. */
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

const TARIFF_KEYS = new Set(['my_licenses', 'buy_license', 'issue_license'])

const isPrimaryItem = item => (
  item.key === 'home' ||
  item.pathname === PROFILE_PAGE_ROUTE ||
  item.pathname === CUSTOMIZATION_PAGE_ROUTE ||
  item.pathname === MY_PROJECTS_ROUTE
)

const makeDivider = key => ({
  type: 'divider',
  key,
})

/**
 * Append a section only if it has items, preceded by a divider when the
 * list already has content.
 */
const appendSection = (items, section, dividerKey) => {
  if (!section.length) {
    return items
  }
  if (items.length) {
    items.push(makeDivider(dividerKey))
  }
  items.push(...section)
  return items
}

/**
 * Order: primary (Home / Profile / Customization / Projects / Explore) →
 * tools → tariffs → rest, separated by dividers.
 */
export const buildSidebarItems = roleItems => {
  const head = []
  const tariffs = []
  const rest = []

  ;(roleItems || []).forEach(item => {
    if (isPrimaryItem(item)) {
      head.push(item)
    } else if (TARIFF_KEYS.has(item.key)) {
      tariffs.push(item)
    } else {
      rest.push(item)
    }
  })

  // Ensure Customization sits right after Profile even if a role omitted it.
  const hasCustomization = head.some(item => item.pathname === CUSTOMIZATION_PAGE_ROUTE)
  if (!hasCustomization) {
    const profileIdx = head.findIndex(item => item.pathname === PROFILE_PAGE_ROUTE)
    if (profileIdx >= 0) {
      head.splice(profileIdx + 1, 0, CustomizationNavItem)
    } else {
      head.unshift(CustomizationNavItem)
    }
  }

  let items = [...head, ExploreNavItem]
  items = appendSection(items, ToolNavItems, 'divider-tools')
  items = appendSection(items, tariffs, 'divider-tariffs')
  items = appendSection(items, rest, 'divider-rest')
  return items
}

/** Flat list of clickable nav entries (skips dividers). */
export const flattenSidebarItems = items => (
  (items || []).filter(item => item && item.type !== 'divider')
)

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
    key: 'my_classes',
    label: <FormattedMessage id='sidebar_data.my_classes' defaultMessage='My classes' />,
    pathname: STUDENT_CLASSES_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: 'my_licenses',
    label: <FormattedMessage id='sidebar_data.my_licenses' />,
    pathname: MY_LICENSES_ROUTE,
    icon: <KeyOutlined />,
    iconAccent: 'green',
  },
  {
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
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
  {
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
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
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
  },
  {
    key: 'issue_license',
    label: <FormattedMessage id='sidebar_data.issue_license' />,
    pathname: ISSUE_LICENSE_ROUTE,
    icon: <PlusCircleOutlined />,
  },
  {
    key: 'users_moderation',
    label: <FormattedMessage id='sidebar_data.users' />,
    pathname: USERS_ROUTE,
    icon: <StopOutlined />,
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
    key: 'teacher_classes',
    label: <FormattedMessage id='sidebar_data.teacher_classes' defaultMessage='Classes' />,
    pathname: TEACHER_CLASSES_ROUTE,
    icon: <GroupOutlined />,
  },
  {
    key: '2',
    label: <FormattedMessage id='sidebar_data.my_projects' defaultMessage='Templates' />,
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
  {
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
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
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
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
    key: 'my_sessions',
    label: <FormattedMessage id='sidebar_data.my_sessions' />,
    pathname: MY_SESSIONS_ROUTE,
    icon: <DesktopOutlined />,
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
