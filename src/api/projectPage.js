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

/** GET /projectPage/:id/download — binary .sb3 (uses fetch to avoid JSON default + body size limits on axios). */
export async function downloadProjectSb3(token, projectPageId, fallbackTitle) {
    const base = config.backendURL[0].replace(/\/?$/, '/')
    const url = `${base}projectPage/${encodeURIComponent(projectPageId)}/download`
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
    })
    if (!res.ok) {
        let msg = res.statusText
        try {
            const t = await res.text()
            if (t) {
                try {
                    const j = JSON.parse(t)
                    if (typeof j === 'string')
                        msg = j
                    else
                        msg = j.message || j.error || String(j)
                } catch (_) {
                    msg = t
                }
            }
        } catch (_) { /* ignore */ }
        throw new Error(msg)
    }
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
}