/** Go time.Time.String(): "2006-01-02 15:04:05.937423 +0300 MSK" */
const GO_CIVIL_TIME =
  /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?) ([+-]\d{2})(\d{2})(?:\s+\S+)?$/

export function parseDateTime(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (value == null || value === '') {
    return null
  }
  const raw = String(value).trim()
  if (!raw) {
    return null
  }

  const go = raw.match(GO_CIVIL_TIME)
  if (go) {
    const parsed = new Date(`${go[1]}T${go[2]}${go[3]}:${go[4]}`)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  const direct = new Date(raw)
  if (!Number.isNaN(direct.getTime())) {
    return direct
  }
  return null
}

export function formatDateTime(value, locale) {
  const date = parseDateTime(value)
  if (!date) return '—'
  // Day-first (not US MM/DD) + 24-hour clock.
  const resolved = String(locale || '').toLowerCase().startsWith('en')
    ? 'en-GB'
    : (locale || 'ru-RU')
  return new Intl.DateTimeFormat(resolved, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}
