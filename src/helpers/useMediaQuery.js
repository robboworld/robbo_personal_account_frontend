import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. SSR-safe: `defaultMatches` only without window.matchMedia.
 * @param {string} query e.g. '(max-width: 991px)'
 * @param {boolean} [defaultMatches=false]
 */
export function useMediaQuery(query, defaultMatches = false) {
  // Read the media query on the first render: starting from the default made phones
  // paint the desktop sider first and then jump to the drawer layout.
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : defaultMatches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [query])

  return matches
}

/** LK shell: desktop sider from theme.above.med (992px). */
export const LK_MOBILE_MQ = '(max-width: 991px)'

export function useIsLkMobile() {
  return useMediaQuery(LK_MOBILE_MQ, false)
}
