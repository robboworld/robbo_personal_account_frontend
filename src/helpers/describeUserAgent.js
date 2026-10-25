// Readable "Browser · OS" for a session row; the raw user agent stays available as a hint.
const BROWSERS = [
  [/YaBrowser\//, 'Яндекс Браузер'],
  [/Edg(A|iOS)?\//, 'Edge'],
  [/OPR\/|Opera/, 'Opera'],
  [/Firefox\/|FxiOS\//, 'Firefox'],
  [/Chrome\/|CriOS\//, 'Chrome'],
  [/Safari\//, 'Safari'],
  [/nwjs|NW\.js/i, 'RobboScratch'],
]

const SYSTEMS = [
  [/Android/, 'Android'],
  [/iPhone|iPad|iPod/, 'iOS'],
  [/Windows/, 'Windows'],
  [/Mac OS X|Macintosh/, 'macOS'],
  [/CrOS/, 'ChromeOS'],
  [/Linux/, 'Linux'],
]

const pick = (table, ua) => (table.find(([re]) => re.test(ua)) || [])[1] || ''

export function describeUserAgent(userAgent) {
  const ua = String(userAgent || '')
  if (!ua) return ''
  // RobboScratch desktop (NW.js) reports Chrome too: check it first.
  const browser = /nwjs|NW\.js/i.test(ua) ? 'RobboScratch' : pick(BROWSERS, ua)
  const system = pick(SYSTEMS, ua)
  return [browser, system].filter(Boolean).join(' · ') || ua.slice(0, 60)
}
