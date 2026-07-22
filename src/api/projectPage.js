import instance from './instance'

import config from '@/config'

function parseContentDispositionFilename(cd) {
    if (!cd)
        return null
    const star = cd.match(/filename\*=UTF-8''([^;\s]+)/i)
    if (star) {
        try {
            return decodeURIComponent(star[1].replace(/\+/g, ' '))
        } catch (_) { /* ignore */ }
    }
    const quoted = cd.match(/filename="([^"]+)"/i)
    if (quoted)
        return quoted[1]
    const plain = cd.match(/filename=([^;\s]+)/i)
    if (plain)
        return plain[1]
    return null
}

function backendBase() {
    return config.backendURL[0].replace(/\/?$/, '/')
}

function currentAccessToken(fallback) {
    const token = localStorage.getItem('token')
    if (token && token !== 'null') {
        return token
    }
    return fallback || ''
}

async function refreshAccessToken() {
    const res = await fetch(`${backendBase()}auth/refresh`, {
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

/** Soft refresh: returns new access token or null (no throw). */
export async function tryRefreshAccessToken() {
    try {
        return await refreshAccessToken()
    } catch (_) {
        return null
    }
}

async function readFetchErrorMessage(res) {
    const msg = res.statusText || 'Request failed'
    try {
        const t = await res.text()
        if (!t) {
            return msg
        }
        try {
            const j = JSON.parse(t)
            if (typeof j === 'string') {
                return j
            }
            return j.message || j.error || String(j)
        } catch (_) {
            return t
        }
    } catch (_) {
        return msg
    }
}

/**
 * Authenticated fetch that reads token from localStorage and retries once after auth/refresh on 401.
 * @param {string} url
 * @param {RequestInit} [init]
 * @param {{ fallbackToken?: string }} [options]
 */
export async function fetchWithAuthRetry(url, init = {}, options = {}) {
    const buildInit = token => {
        const headers = new Headers(init.headers || {})
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        } else {
            headers.delete('Authorization')
        }
        return {
            ...init,
            headers,
            credentials: init.credentials ?? 'include',
        }
    }

    let token = currentAccessToken(options.fallbackToken)
    const res = await fetch(url, buildInit(token))
    if (res.status !== 401) {
        return res
    }

    try {
        token = await refreshAccessToken()
    } catch (_) {
        return res
    }
    return fetch(url, buildInit(token))
}

async function saveSb3Blob(res, fallbackTitle) {
    const blob = await res.blob()
    let filename = parseContentDispositionFilename(res.headers.get('Content-Disposition'))
    if (!filename) {
        const safe = (fallbackTitle || 'project').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'project'
        filename = `${safe}.sb3`
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}

/** GET /projectPage/:id/download — binary .sb3 (uses fetch to avoid JSON default + body size limits on axios). */
export async function downloadProjectSb3(token, projectPageId, fallbackTitle) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/download`
    const res = await fetchWithAuthRetry(url, { method: 'GET' }, { fallbackToken: token })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    await saveSb3Blob(res, fallbackTitle)
}

/** Guest download via play token: GET /projectPage/:id/download?token=... */
export async function downloadProjectSb3ByPlayToken(playToken, projectPageId, fallbackTitle) {
    const token = extractTokenFromPlayPayload(playToken)
    if (!token) {
        throw new Error('Play token is missing')
    }
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/download?token=${encodeURIComponent(token)}`
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    await saveSb3Blob(res, fallbackTitle)
}

function extractTokenFromPlayPayload(playToken) {
    if (!playToken) return ''
    if (typeof playToken === 'string') return playToken.trim()
    const src = playToken.playUrl || playToken.jsonUrl || ''
    if (!src) return ''
    try {
        const u = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
        return u.searchParams.get('token') || ''
    } catch (_) {
        const match = String(src).match(/[?&]token=([^&]+)/)
        return match ? decodeURIComponent(match[1]) : ''
    }
}

export const projectPageAPI = {
    createProjectPage(token) {
        return instance.post('projectPage/',
            {
                projectPage: {},
            },
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    deleteProjectPage(token, projectPageId) {
        return instance.delete(`projectPage/${projectPageId}`,
            {
                // withCredentials: true,
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // },
            })
    },

    updateProjectPage(token, projectPage) {
        return instance.put('projectPage/',
            {
                projectPage: projectPage,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getProjectPageById(token, id) {
        return instance.get(`projectPage/${id}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    getAllProjectPages(token) {
        return instance.get('projectPage/',
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            },
        )
    },

    getPublicProjectPages(token, page = '1', pageSize = '20') {
        return instance.get(`projectPage/public?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },

    /** Guest-safe public catalog (never sends Authorization). */
    async fetchPublicProjectPages(page = '1', pageSize = '20', options = {}) {
        const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
        })
        if (options.featured) {
            params.set('featured', String(options.featured))
        }
        const url = `${backendBase()}projectPage/public?${params.toString()}`
        const res = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'include',
        })
        if (!res.ok) {
            throw new Error(res.statusText || 'Failed to load public projects')
        }
        return res.json()
    },

    /** Guest-safe project page + playToken (never sends Authorization). */
    async fetchProjectPageById(id) {
        const url = `${backendBase()}projectPage/${encodeURIComponent(id)}`
        const res = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'include',
        })
        if (!res.ok) {
            const err = new Error(await readFetchErrorMessage(res))
            err.status = res.status
            throw err
        }
        return res.json()
    },

    getProjectPlayToken(token, projectPageId) {
        return instance.get(`projectPage/${encodeURIComponent(projectPageId)}/play-token`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
    },
}

export async function fetchReactionTypes() {
    const res = await fetch(`${backendBase()}projectPage/reaction-types`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include',
    })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}

export async function fetchProjectReactions(projectPageId) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/reactions`
    const token = currentAccessToken()
    const res = token
        ? await fetchWithAuthRetry(url, { method: 'GET', headers: { Accept: 'application/json' } })
        : await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'include',
        })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}

export async function putProjectReaction(projectPageId, code) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/reactions`
    const res = await fetchWithAuthRetry(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}

export async function deleteProjectReaction(projectPageId) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/reactions`
    const res = await fetchWithAuthRetry(url, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}

/** POST /projectPage/:id/preview — owner preview image upload. */
export async function uploadProjectPreview(token, projectPageId, file) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/preview`
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetchWithAuthRetry(url, {
        method: 'POST',
        body: formData,
    }, { fallbackToken: token })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}

/** POST /projectPage/:id/upload — .sb3 file upload (multipart). */
export async function uploadProjectSb3(token, projectPageId, file) {
    const url = `${backendBase()}projectPage/${encodeURIComponent(projectPageId)}/upload`
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetchWithAuthRetry(url, {
        method: 'POST',
        body: formData,
    }, { fallbackToken: token })
    if (!res.ok) {
        throw new Error(await readFetchErrorMessage(res))
    }
    return res.json()
}