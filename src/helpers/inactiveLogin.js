/**
 * Build /login URL for a banned/inactive account, optionally with ban details.
 * @param {{ reason?: string, expiresAt?: string|null, isPermanent?: boolean }} [ban]
 */
export function buildInactiveLoginURL(ban) {
  const params = new URLSearchParams()
  params.set('err', 'user_inactive')
  if (ban?.reason) {
    params.set('reason', String(ban.reason).slice(0, 500))
  }
  if (ban?.isPermanent) {
    params.set('permanent', '1')
  } else if (ban?.expiresAt) {
    params.set('expiresAt', ban.expiresAt)
  }
  return `/login?${params.toString()}`
}

/**
 * Parse ban info from login page search params.
 * @param {string} search
 * @returns {{ reason: string, expiresAt: string|null, isPermanent: boolean }|null}
 */
export function parseInactiveLoginSearch(search) {
  const params = new URLSearchParams(search || '')
  if (params.get('err') !== 'user_inactive') {
    return null
  }
  const reason = params.get('reason') || ''
  const expiresAt = params.get('expiresAt') || null
  const isPermanent = params.get('permanent') === '1'
  return { reason, expiresAt, isPermanent }
}

/**
 * @param {object} intl react-intl intl
 * @param {{ reason?: string, expiresAt?: string|null, isPermanent?: boolean }|null} ban
 */
export function formatInactiveBanDescription(intl, ban) {
  const lines = [intl.formatMessage({ id: 'login.inactive.title' })]
  if (ban?.reason) {
    lines.push(intl.formatMessage({ id: 'login.inactive.reason' }, { reason: ban.reason }))
  }
  if (ban?.isPermanent) {
    lines.push(intl.formatMessage({ id: 'login.inactive.permanent' }))
  } else if (ban?.expiresAt) {
    let when = ban.expiresAt
    try {
      when = new Intl.DateTimeFormat(intl.locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(ban.expiresAt))
    } catch {
      // keep raw
    }
    lines.push(intl.formatMessage({ id: 'login.inactive.until' }, { date: when }))
  }
  return lines.join('\n')
}
