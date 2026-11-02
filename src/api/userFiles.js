import instance from './instance'

import { fetchWithAuthRetry, saveResponseBlob } from '@/api/projectPage'
import { apiBase } from '@/api/authRefresh'

// Personal file cloud (/api/files). Files count toward the same storage quota as projects.

// Matches the backend uploadTimeout: 50 MB on a slow line takes minutes, not the default 30 s.
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000

/** Extensions the backend accepts (it checks the content too); value for Upload `accept`. */
export const ALLOWED_FILE_EXTENSIONS = Object.freeze([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.pdf',
  '.docx',
  '.xlsx',
  '.pptx',
  '.odt',
  '.txt',
  '.sb3',
  '.mp3',
  '.wav',
  '.ogg',
  '.zip',
  '.sb',
  '.sb2',
  '.ino',
  '.stl',
  '.fcstd',
  '.skp',
])

export const ALLOWED_FILE_ACCEPT = ALLOWED_FILE_EXTENSIONS.join(',')

export function isAllowedFileName(name) {
  const dot = String(name || '').lastIndexOf('.')
  if (dot < 0) return false
  return ALLOWED_FILE_EXTENSIONS.includes(String(name).slice(dot).toLowerCase())
}

/** GET /api/files → [{ id, name, kind, mime, sizeBytes, createdAt }] */
export async function listFiles() {
  const { data } = await instance.get('/api/files')
  return data?.files || []
}

/**
 * POST /api/files, multipart field `file`. onProgress gets 0..100.
 * Content-Type is set explicitly: the instance default is JSON, and axios would turn
 * FormData into a JSON body; the browser adapter then replaces it with the boundary.
 */
export async function uploadFile(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await instance.post('/api/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: UPLOAD_TIMEOUT_MS,
    onUploadProgress: event => {
      if (!onProgress) return
      const total = event.total || file?.size || 0
      if (total > 0) {
        onProgress(Math.min(100, Math.round((event.loaded / total) * 100)))
      }
    },
  })
  return data?.file || null
}

/** A failed fetch Response as an axios-like error, so apiErrorMessage maps the backend code. */
export async function fetchErrorWithBody(res) {
  let data = null
  try {
    const text = await res.text()
    try {
      data = text ? JSON.parse(text) : null
    } catch (_) {
      data = text
    }
  } catch (_) {
    /* body unreadable */
  }
  const err = new Error(res.statusText || 'Request failed')
  err.status = res.status
  err.response = { status: res.status, data }
  return err
}

/** GET /api/files/:id/download — binary via fetch (no JSON parsing, no axios timeout). */
export async function downloadFile(id, fallbackName) {
  const url = `${apiBase()}/api/files/${encodeURIComponent(id)}/download`
  const res = await fetchWithAuthRetry(url, { method: 'GET' })
  if (!res.ok) {
    throw await fetchErrorWithBody(res)
  }
  await saveResponseBlob(res, fallbackName || 'file')
}

/** DELETE /api/files/:id → 204 */
export async function deleteFile(id) {
  await instance.delete(`/api/files/${encodeURIComponent(id)}`)
}
