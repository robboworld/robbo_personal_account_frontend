import { clearAccessToken, getAccessToken } from '@/helpers/accessTokenMemory'
import { apiBase, refreshAccessToken } from '@/api/authRefresh'

function authHeaders(extra = {}) {
  const h = { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...extra }
  const t = getAccessToken()
  if (t && t !== 'null') {
    h.Authorization = `Bearer ${t}`
  }
  return h
}

async function readErrorMessage(res) {
  try {
    const err = await res.json()
    return err.error || err.message || res.statusText
  } catch {
    return res.statusText || 'Request failed'
  }
}

/**
 * Authenticated notification fetch: retries once after /auth/refresh on 401.
 */
async function notifyFetch(path, init = {}) {
  const doFetch = () =>
    fetch(`${apiBase()}${path}`, {
      ...init,
      credentials: 'include',
      headers: authHeaders(init.headers || {}),
    })

  const res = await doFetch()
  if (res.status !== 401) {
    return res
  }

  try {
    await refreshAccessToken()
  } catch (e) {
    clearAccessToken()
    throw e
  }

  return doFetch()
}

async function notifyJson(path, init = {}) {
  const res = await notifyFetch(path, init)
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  return res.json()
}

/** source: 'lk' (LK notifications and announcements), 'lms' (Open edX ones) or '' (both). */
export async function fetchNotificationFeed(limit = 30, source = '') {
  const query = source ? `&source=${encodeURIComponent(source)}` : ''
  return notifyJson(`/api/notifications/feed?limit=${limit}${query}`)
}

/** { count, lk, lms, lmsEnabled }: unread in all, in LK, in Open edX; is there an LMS tab. */
export async function fetchUnreadNotificationCount() {
  return notifyJson('/api/notifications/unread-count')
}

export async function markPersonalNotificationRead(id) {
  return notifyJson('/api/notifications/mark-personal-read', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

export async function markAnnouncementRead(id) {
  return notifyJson('/api/notifications/mark-announcement-read', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

/** An Open edX notification (feedKind "lms"): read in the LMS too, the LMS keeps them. */
export async function markLmsNotificationRead(id) {
  return notifyJson('/api/notifications/mark-lms-read', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

/** source: one tab of the bell ('lk' or 'lms'); '' = everything. */
export async function markAllNotificationsRead(source = '') {
  return notifyJson('/api/notifications/mark-all-read', {
    method: 'POST',
    body: source ? JSON.stringify({ source }) : undefined,
  })
}

export async function adminSendPersonalNotification(payload) {
  return notifyJson('/api/notifications/admin/personal', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function adminCreateAnnouncement(payload) {
  return notifyJson('/api/notifications/admin/announcement', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Sends the teacher has left in the last 24 hours: { limit, used, remaining }; limit 0 = unlimited. */
export async function fetchTeacherNotificationQuota() {
  return notifyJson('/api/notifications/teacher/quota')
}

/** Teacher → students of their own classes; the server rejects anyone else. */
export async function teacherSendNotification(payload) {
  return notifyJson('/api/notifications/teacher/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
