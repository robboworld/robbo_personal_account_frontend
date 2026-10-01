import { useEffect, useState } from 'react'

import { fetchOidcStatus } from '@/helpers/oidcSession'
import {
  CLIENTS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  ROBBO_UNITS_ROUTE,
  TEACHERS_PAGE_ROUTE,
  UNIT_ADMINS_ROUTE,
} from '@/constants'

// Pages backed by the legacy Postgres (units, groups, clients, teachers, unit admins).
// With the legacy database off they can only show errors, so the menu hides them.
export const LEGACY_ADMIN_ROUTES = new Set([
  CLIENTS_ROUTE,
  ROBBO_UNITS_ROUTE,
  ROBBO_GROUPS_ROUTE,
  UNIT_ADMINS_ROUTE,
  TEACHERS_PAGE_ROUTE,
])

let legacyFlag = null

/** Whether the backend runs with the legacy database (/auth/oidc/status legacy_auth). Cached. */
export function fetchLegacyAdminEnabled () {
  if (!legacyFlag) {
    legacyFlag = fetchOidcStatus()
      .then(status => Boolean(status?.legacy_auth))
      .catch(() => {
        legacyFlag = null
        return false
      })
  }
  return legacyFlag
}

export function useLegacyAdminEnabled () {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    let active = true
    fetchLegacyAdminEnabled().then(value => {
      if (active) {
        setEnabled(value)
      }
    })
    return () => {
      active = false
    }
  }, [])
  return enabled
}

/** Drops legacy admin entries (also inside groups) unless the legacy database is on. */
export function withoutLegacyAdminItems (items, legacyEnabled) {
  if (legacyEnabled) {
    return items
  }
  return items
    .filter(item => !LEGACY_ADMIN_ROUTES.has(item.pathname))
    .map(item => (item.children
      ? { ...item, children: withoutLegacyAdminItems(item.children, legacyEnabled) }
      : item))
}
