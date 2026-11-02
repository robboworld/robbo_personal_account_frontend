import instance from './instance'

import { fetchWithAuthRetry, saveResponseBlob } from '@/api/projectPage'
import { apiBase } from '@/api/authRefresh'
import { fetchErrorWithBody } from '@/api/userFiles'

// Super admin: another user's projects and files. Every download and delete carries a
// reason and lands in the audit log on the backend.

const userPath = userId => `/api/admin/users/${encodeURIComponent(userId)}`

const safeFileName = (name, fallback) =>
  String(name || '')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .trim() || fallback

/** GET …/content → { usage, filesEnabled, projects, files } */
export async function getUserContent(userId) {
  const { data } = await instance.get(`${userPath(userId)}/content`)
  return {
    usage: data?.usage || null,
    filesEnabled: Boolean(data?.filesEnabled),
    projects: data?.projects || [],
    files: data?.files || [],
  }
}

/** GET …/audit?limit= → newest first */
export async function getUserAudit(userId, limit = 50) {
  const { data } = await instance.get(`${userPath(userId)}/audit`, { params: { limit } })
  return data?.items || []
}

async function downloadWithReason(path, reason, fallbackName) {
  const res = await fetchWithAuthRetry(`${apiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })
  if (!res.ok) {
    throw await fetchErrorWithBody(res)
  }
  await saveResponseBlob(res, fallbackName)
}

/** POST …/projects/:id/download → .sb3 */
export function downloadUserProject(userId, projectId, reason, title) {
  return downloadWithReason(
    `${userPath(userId)}/projects/${encodeURIComponent(projectId)}/download`,
    reason,
    `${safeFileName(title, 'project')}.sb3`,
  )
}

/** POST …/files/:id/download → the file as stored */
export function downloadUserFile(userId, fileId, reason, name) {
  return downloadWithReason(
    `${userPath(userId)}/files/${encodeURIComponent(fileId)}/download`,
    reason,
    safeFileName(name, 'file'),
  )
}

/** DELETE …/projects/:id with { reason } → 204 */
export async function deleteUserProject(userId, projectId, reason) {
  await instance.delete(`${userPath(userId)}/projects/${encodeURIComponent(projectId)}`, {
    data: { reason },
  })
}

/** DELETE …/files/:id with { reason } → 204 */
export async function deleteUserFile(userId, fileId, reason) {
  await instance.delete(`${userPath(userId)}/files/${encodeURIComponent(fileId)}`, {
    data: { reason },
  })
}
