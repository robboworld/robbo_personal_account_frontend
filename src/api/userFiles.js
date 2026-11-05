import axios from 'axios'

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

/** user_files.kind → the extensions that give it (the backend keeps WebP as PNG). */
export const EXTENSIONS_BY_KIND = Object.freeze({
  png: ['.png', '.webp'],
  jpeg: ['.jpg', '.jpeg'],
  gif: ['.gif'],
  pdf: ['.pdf'],
  docx: ['.docx'],
  xlsx: ['.xlsx'],
  pptx: ['.pptx'],
  odt: ['.odt'],
  txt: ['.txt'],
  sb: ['.sb'],
  sb2: ['.sb2'],
  sb3: ['.sb3'],
  mp3: ['.mp3'],
  wav: ['.wav'],
  ogg: ['.ogg'],
  zip: ['.zip'],
  ino: ['.ino'],
  stl: ['.stl'],
  fcstd: ['.fcstd'],
  skp: ['.skp'],
})

/** File kinds by the program they come from, for a file assignment's "accepted types". */
export const FILE_KIND_GROUPS = Object.freeze([
  { key: 'arduino', kinds: ['ino'] },
  { key: 'freecad', kinds: ['fcstd'] },
  { key: 'sketchup', kinds: ['skp'] },
  { key: 'model3d', kinds: ['stl'] },
  { key: 'scratch', kinds: ['sb3', 'sb2', 'sb'] },
  { key: 'documents', kinds: ['pdf', 'docx', 'xlsx', 'pptx', 'odt', 'txt'] },
  { key: 'images', kinds: ['png', 'jpeg', 'gif'] },
  { key: 'audio', kinds: ['mp3', 'wav', 'ogg'] },
  { key: 'archive', kinds: ['zip'] },
])

/** ".fcstd, .stl" for the kinds a file assignment accepts. */
export const kindsLabel = kinds => kinds.flatMap(k => EXTENSIONS_BY_KIND[k] || [k]).join(', ')

/** Upload `accept` for the given kinds; every allowed extension when none are given. */
export const acceptForKinds = kinds =>
  (kinds?.length ? kinds.flatMap(k => EXTENSIONS_BY_KIND[k] || []) : ALLOWED_FILE_EXTENSIONS).join(
    ',',
  )

/** The kind a file name gives, or '' when "Мои файлы" does not take it. */
export function kindOfFileName(name) {
  const dot = String(name || '').lastIndexOf('.')
  if (dot < 0) return ''
  const ext = String(name).slice(dot).toLowerCase()
  return Object.keys(EXTENSIONS_BY_KIND).find(k => EXTENSIONS_BY_KIND[k].includes(ext)) || ''
}

export function isAllowedFileName(name) {
  const dot = String(name || '').lastIndexOf('.')
  if (dot < 0) return false
  return ALLOWED_FILE_EXTENSIONS.includes(String(name).slice(dot).toLowerCase())
}

/** "report.v2.pdf" → { stem: 'report.v2', ext: '.pdf' }; the backend keeps ext on rename. */
export function splitFileName(name) {
  const value = String(name || '')
  const dot = value.lastIndexOf('.')
  return dot > 0 ? { stem: value.slice(0, dot), ext: value.slice(dot) } : { stem: value, ext: '' }
}

/** GET /api/files → [{ id, name, kind, mime, sizeBytes, createdAt }] */
export async function listFiles() {
  const { data } = await instance.get('/api/files')
  return data?.files || []
}

/**
 * POST /api/files, multipart field `file`. onProgress gets 0..100; signal cancels the upload.
 * Content-Type is set explicitly: the instance default is JSON, and axios would turn
 * FormData into a JSON body; the browser adapter then replaces it with the boundary.
 */
export async function uploadFile(file, onProgress, signal) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await instance.post('/api/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: UPLOAD_TIMEOUT_MS,
    signal,
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

/** True for the rejection of an upload stopped through its signal: axios here, fetch for .sb3. */
export const isUploadCanceled = error => axios.isCancel(error) || error?.name === 'AbortError'

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

/** PATCH /api/files/:id { name } → the file; name is whole, with the same extension. */
export async function renameFile(id, name) {
  const { data } = await instance.patch(`/api/files/${encodeURIComponent(id)}`, { name })
  return data?.file || null
}

/** DELETE /api/files/:id → 204 */
export async function deleteFile(id) {
  await instance.delete(`/api/files/${encodeURIComponent(id)}`)
}
