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
 * Open the standalone RobboScratch web editor in a new tab for the given cloud project.
 * @param {string} projectPageId
 * @returns {Window|null}
 */
export function openScratchEditor(projectPageId) {
  if (!projectPageId) {
    return null
  }
  const base = alignLoopbackUrlHost((config.scratchURL || '').replace(/\/?$/, '/'))
  const params = new URLSearchParams()
  params.set('projectPageId', projectPageId)
  const url = `${base}?${params.toString()}`
  return window.open(url, '_blank', 'noopener,noreferrer')
}
