import config from '@/config'

/**
 * Absolute URL for project preview image (`/projectPage/:id/preview` or absolute).
 */
export function resolveProjectPreviewUrl(preview, cacheKey) {
  if (!preview) {
    return ''
  }
  if (/^https?:\/\//i.test(preview) || preview.startsWith('data:')) {
    return preview
  }
  const base = (config.backendURL?.[0] || '').replace(/\/?$/, '/')
  let url = `${base}${String(preview).replace(/^\//, '')}`
  const key = cacheKey == null || cacheKey === '' ? '' : String(cacheKey)
  if (key) {
    url = `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(key)}`
  }
  return url
}
