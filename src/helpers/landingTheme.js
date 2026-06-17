import { useCallback, useEffect, useState } from 'react'

export const LANDING_THEME_KEY = 'scratch-landing-theme'
export const LANDING_THEME_EVENT = 'landing-theme-change'

export function readLandingThemeDark() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const stored = localStorage.getItem(LANDING_THEME_KEY)
    if (stored === 'dark') {
      return true
    }
    if (stored === 'light') {
      return false
    }
  } catch {
    /* ignore */
  }

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

export function writeLandingThemeDark(dark) {
  try {
    localStorage.setItem(LANDING_THEME_KEY, dark ? 'dark' : 'light')
  } catch {
    /* ignore */
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(LANDING_THEME_EVENT, { detail: { dark } }),
    )
  }
}

export function useLandingTheme() {
  const [dark, setDark] = useState(readLandingThemeDark)

  useEffect(() => {
    const onThemeChange = event => {
      setDark(Boolean(event.detail?.dark))
    }

    window.addEventListener(LANDING_THEME_EVENT, onThemeChange)
    return () => window.removeEventListener(LANDING_THEME_EVENT, onThemeChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !readLandingThemeDark()
    writeLandingThemeDark(next)
    setDark(next)
  }, [])

  return { dark, toggleTheme }
}
