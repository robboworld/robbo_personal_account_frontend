import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. SSR-safe: returns `defaultMatches` until mount.
 * @param {string} query e.g. '(max-width: 991px)'
 * @param {boolean} [defaultMatches=false]
 */
export function useMediaQuery(query, defaultMatches = false) {
  const [matches, setMatches] = useState(defaultMatches)

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
