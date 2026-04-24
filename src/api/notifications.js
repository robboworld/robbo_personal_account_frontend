import config from '@/config'

const apiBase = () => (config.backendURL && config.backendURL[0]) ? config.backendURL[0].replace(/\/$/, '') : 'http://localhost:8080'

const headers = () => {
    const h = { 'Content-Type': 'application/json' }
    const t = localStorage.getItem('token')
    if (t) {
        h.Authorization = `Bearer ${t}`
    }
    return h
}

export async function fetchNotificationFeed(limit = 30) {
    const res = await fetch(`${apiBase()}/api/notifications/feed?limit=${limit}`, {
        headers: headers(),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function fetchUnreadNotificationCount() {
    const res = await fetch(`${apiBase()}/api/notifications/unread-count`, {
        headers: headers(),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function markPersonalNotificationRead(id) {
    const res = await fetch(`${apiBase()}/api/notifications/mark-personal-read`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ id }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function markAnnouncementRead(id) {
    const res = await fetch(`${apiBase()}/api/notifications/mark-announcement-read`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ id }),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function markAllNotificationsRead() {
    const res = await fetch(`${apiBase()}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: headers(),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function adminSendPersonalNotification(payload) {
    const res = await fetch(`${apiBase()}/api/notifications/admin/personal`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}

export async function adminCreateAnnouncement(payload) {
    const res = await fetch(`${apiBase()}/api/notifications/admin/announcement`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
    }
    return res.json()
}
