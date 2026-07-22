import config from '@/config'

const apiBase = () => (config.backendURL && config.backendURL[0]) ? config.backendURL[0].replace(/\/$/, '') : 'http://localhost:8080'

function authHeaders(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra }
    const t = localStorage.getItem('token')
    if (t && t !== 'null') {
        h.Authorization = `Bearer ${t}`
    }
    return h
}

async function refreshAccessToken() {
    const res = await fetch(`${apiBase()}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
    })
    if (!res.ok) {
        throw new Error('Session expired')
    }
    const data = await res.json()
    const accessToken = data?.accessToken
    if (!accessToken) {
        throw new Error('Session expired')
    }
    localStorage.setItem('token', accessToken)
    return accessToken
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
    const doFetch = () => fetch(`${apiBase()}${path}`, {
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
        localStorage.removeItem('token')
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

export async function fetchNotificationFeed(limit = 30) {
    return notifyJson(`/api/notifications/feed?limit=${limit}`)
}

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

export async function markAllNotificationsRead() {
    return notifyJson('/api/notifications/mark-all-read', {
        method: 'POST',
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
