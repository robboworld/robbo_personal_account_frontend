import { useEffect, useRef } from 'react'

/** Calls back every ms while the tab is visible: a live mark needs no traffic from a hidden tab. */
export function useVisibleInterval(callback, ms) {
  const latest = useRef(callback)
  useEffect(() => {
    latest.current = callback
  })
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) latest.current()
    }, ms)
    return () => clearInterval(id)
  }, [ms])
}
