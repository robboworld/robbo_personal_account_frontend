export function formatDateTime(value, locale) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
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
