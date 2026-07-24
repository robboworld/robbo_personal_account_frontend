import config from '@/config'

function isLoopbackHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

/**
 * Cookies for API host are bound to hostname. Align loopback editor URL with the
 * current ЛК page host (localhost vs 127.0.0.1) so refresh_token stays valid.
 * @param {string} url
 * @returns {string}
 */
function alignLoopbackUrlHost(url) {
  if (!url || typeof window === 'undefined' || !window.location) {
    return url
  }
  try {
    const parsed = new URL(url, window.location.origin)
    const pageHost = window.location.hostname
    if (isLoopbackHost(pageHost) && isLoopbackHost(parsed.hostname) && parsed.hostname !== pageHost) {
      parsed.hostname = pageHost
      return parsed.toString()
    }
  } catch {
    /* ignore */
  }
  return url
}

/**
 * Standalone RobboScratch web editor origin.
 * Single switch: `SCRATCH_EDITOR_URL` → `config.scratchURL`
 * (local: http://localhost:8601/, prod: https://scratch.ru/).
 * @param {string} [projectPageId]
 * @returns {string}
 */
export function getScratchEditorUrl(projectPageId) {
  const base = alignLoopbackUrlHost((config.scratchURL || '').replace(/\/?$/, '/'))
  if (!projectPageId) {
    return base
  }
  const params = new URLSearchParams()
  params.set('projectPageId', projectPageId)
  return `${base}?${params.toString()}`
}

/**
 * Open the standalone RobboScratch web editor in the current tab for the given cloud project.
 * @param {string} projectPageId
 */
export function openScratchEditor(projectPageId) {
  if (!projectPageId) {
    return
  }
  window.location.assign(getScratchEditorUrl(projectPageId))
}
