import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useIntl } from 'react-intl'

import {
  CLIENTS_ROUTE,
  CUSTOMIZATION_PAGE_ROUTE,
  DEVICE_LINK_ROUTE,
  HOME_PAGE_ROUTE,
  ISSUE_LICENSE_ROUTE,
  MY_LICENSES_ROUTE,
  MY_PROJECTS_ROUTE,
  MY_SESSIONS_ROUTE,
  PAYMENT_RECEIPT_ROUTE,
  PROFILE_PAGE_ROUTE,
  PUBLIC_PROJECTS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  ROBBO_UNIT_STUDENT_GROUPS_PAGE,
  ROBBO_UNITS_ROUTE,
  SCRATCH_HUB_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  STUDENT_CLASSES_ROUTE,
  TEACHER_CLASS_BOARD_ROUTE,
  TEACHER_CLASSES_ROUTE,
  TEACHERS_PAGE_ROUTE,
  UNIT_ADMINS_ROUTE,
  USERS_ROUTE,
} from '@/constants'

// First match wins: specific routes before their prefixes.
const PAGE_TITLES = [
  [HOME_PAGE_ROUTE, 'sidebar_data.home'],
  [PROFILE_PAGE_ROUTE, 'sidebar_data.profile'],
  [CUSTOMIZATION_PAGE_ROUTE, 'sidebar_data.customization'],
  [MY_PROJECTS_ROUTE, 'sidebar_data.my_projects'],
  [PUBLIC_PROJECTS_ROUTE, 'sidebar_data.public_projects'],
  [SCRATCH_HUB_ROUTE, 'sidebar_data.scratch_ru'],
  [TEACHER_CLASS_BOARD_ROUTE, 'sidebar_data.teacher_classes'],
  [TEACHER_CLASSES_ROUTE, 'sidebar_data.teacher_classes'],
  [STUDENT_CLASSES_ROUTE, 'sidebar_data.my_classes'],
  [ISSUE_LICENSE_ROUTE, 'sidebar_data.issue_license'],
  [PAYMENT_RECEIPT_ROUTE, 'sidebar_data.my_licenses'],
  [MY_LICENSES_ROUTE, 'sidebar_data.my_licenses'],
  [MY_SESSIONS_ROUTE, 'sidebar_data.my_sessions'],
  [DEVICE_LINK_ROUTE, 'sidebar_data.my_licenses'],
  [USERS_ROUTE, 'sidebar_data.users'],
  [SEND_NOTIFICATION_ROUTE, 'sidebar_data.send_notification'],
  [CLIENTS_ROUTE, 'sidebar_data.clients'],
  [TEACHERS_PAGE_ROUTE, 'sidebar_data.teachers'],
  [UNIT_ADMINS_ROUTE, 'sidebar_data.unit_admins'],
  [ROBBO_UNIT_STUDENT_GROUPS_PAGE, 'sidebar_data.robbo_groups'],
  [ROBBO_UNITS_ROUTE, 'sidebar_data.robbo_units'],
  [ROBBO_GROUPS_ROUTE, 'sidebar_data.robbo_groups'],
]

export function pageTitleId(pathname) {
  const hit = PAGE_TITLES.find(([pattern]) => matchPath({ path: pattern, end: true }, pathname))
  return hit ? hit[1] : null
}

/** Names the browser tab after the open LK page, so tabs, history and bookmarks are tell-apart. */
const DocumentTitle = () => {
  const { pathname } = useLocation()
  const intl = useIntl()

  useEffect(() => {
    const brand = intl.formatMessage({ id: 'document_title.brand' })
    const id = pageTitleId(pathname)
    document.title = id ? `${intl.formatMessage({ id })} — ${brand}` : brand
  }, [pathname, intl])

  return null
}

export default DocumentTitle
