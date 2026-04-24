import {
  CLIENTS_ROUTE,
  MY_PROJECTS_ROUTE,
  PROFILE_PAGE_ROUTE,
  ROBBO_GROUPS_ROUTE,
  ROBBO_UNITS_ROUTE,
  SEND_NOTIFICATION_ROUTE,
  TEACHERS_PAGE_ROUTE,
  UNIT_ADMINS_ROUTE,
  STUDENT,
  UNIT_ADMIN,
  SUPER_ADMIN,
  PARENT,
  FREE_LISTENER,
  TEACHER,
} from '@/constants'

const exactByRole = {
  [STUDENT]: {
    [PROFILE_PAGE_ROUTE]: '1',
    [MY_PROJECTS_ROUTE]: '2',
  },
  [PARENT]: {
    [PROFILE_PAGE_ROUTE]: '1',
  },
  [TEACHER]: {
    [PROFILE_PAGE_ROUTE]: '1',
  },
  [UNIT_ADMIN]: {
    [PROFILE_PAGE_ROUTE]: '1',
    [ROBBO_UNITS_ROUTE]: '2',
    [TEACHERS_PAGE_ROUTE]: '4',
    [ROBBO_GROUPS_ROUTE]: '6',
    [SEND_NOTIFICATION_ROUTE]: 'send_notification',
  },
  [SUPER_ADMIN]: {
    [PROFILE_PAGE_ROUTE]: '1',
    [CLIENTS_ROUTE]: '5',
    [ROBBO_UNITS_ROUTE]: '6',
    [ROBBO_GROUPS_ROUTE]: '7',
    [UNIT_ADMINS_ROUTE]: '9',
    [TEACHERS_PAGE_ROUTE]: '10',
    [SEND_NOTIFICATION_ROUTE]: 'send_notification',
  },
  [FREE_LISTENER]: {
    [PROFILE_PAGE_ROUTE]: '1',
  },
}

/**
 * Ключ пункта бокового меню по текущему пути (когда нет state.selectedNavBarKey).
 */
export function getSelectedNavBarKeyFromPath(role, pathname) {
  if (pathname == null || pathname === '') {
    return undefined
  }

  const exact = exactByRole[role]?.[pathname]
  if (exact != null) {
    return exact
  }

  if (role === STUDENT && pathname.startsWith('/projects/')) {
    return '2'
  }

  if (role === UNIT_ADMIN) {
    if (pathname.startsWith(SEND_NOTIFICATION_ROUTE)) {
      return 'send_notification'
    }
    if (pathname.startsWith(TEACHERS_PAGE_ROUTE)) {
      return '4'
    }
    if (pathname.startsWith(ROBBO_GROUPS_ROUTE)) {
      return '6'
    }
    if (pathname.startsWith(`${ROBBO_UNITS_ROUTE}/`) && pathname.includes('/groups')) {
      return '6'
    }
    if (pathname.startsWith(ROBBO_UNITS_ROUTE)) {
      return '2'
    }
  }

  if (role === SUPER_ADMIN) {
    if (pathname.startsWith(SEND_NOTIFICATION_ROUTE)) {
      return 'send_notification'
    }
    if (pathname.startsWith(CLIENTS_ROUTE)) {
      return '5'
    }
    if (pathname.startsWith(UNIT_ADMINS_ROUTE)) {
      return '9'
    }
    if (pathname.startsWith(TEACHERS_PAGE_ROUTE)) {
      return '10'
    }
    if (pathname.startsWith(ROBBO_GROUPS_ROUTE)) {
      return '7'
    }
    if (pathname.startsWith(`${ROBBO_UNITS_ROUTE}/`) && pathname.includes('/groups')) {
      return '7'
    }
    if (pathname.startsWith(ROBBO_UNITS_ROUTE)) {
      return '6'
    }
  }

  return undefined
}
