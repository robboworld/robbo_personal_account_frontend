import config from '@/config'
import { readStoredLanguage } from '@/helpers/intl'

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
 * (local: http://localhost:8601/, prod: https://scratch.example.com/).
 * @param {string} [projectPageId]
 * @returns {string}
 */
export function getScratchEditorUrl(projectPageId) {
  const base = alignLoopbackUrlHost((config.scratchURL || '').replace(/\/?$/, '/'))
  const params = new URLSearchParams()
  if (projectPageId) {
    params.set('projectPageId', projectPageId)
  }
  // RobboScratch takes ?locale= before its own saved choice and the browser language,
  // so the editor opens in the language of the LK rather than in English.
  params.set('locale', readStoredLanguage())
  return `${base}?${params.toString()}`
}

/** Editor address as people type it, e.g. "lk.edu.robbo.ru/scratch" or "localhost:8601" (for texts). */
export function getScratchEditorLabel() {
  try {
    const url = new URL(getScratchEditorUrl())
    return `${url.host}${url.pathname}`.replace(/\/$/, '')
  } catch {
    return ''
  }
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
