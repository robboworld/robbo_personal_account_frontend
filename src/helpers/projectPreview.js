import config from '@/config'

/**
 * Absolute URL for project preview image (`/projectPage/:id/preview` or absolute).
 */
export function resolveProjectPreviewUrl(preview) {
  if (!preview) {
    return ''
  }
  if (/^https?:\/\//i.test(preview) || preview.startsWith('data:')) {
    return preview
  }
  const base = (config.backendURL?.[0] || '').replace(/\/?$/, '/')
  return `${base}${String(preview).replace(/^\//, '')}`
}
