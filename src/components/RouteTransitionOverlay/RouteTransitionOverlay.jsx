import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Loader from '@/components/Loader'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 248, 244, 0.72);
  pointer-events: none;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: opacity 0.15s ease;
`

const RouteTransitionOverlay = () => {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return undefined
    }

    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 180)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  if (!visible) {
    return null
  }

  return (
    <Overlay $visible={visible} aria-hidden>
      <Loader />
    </Overlay>
  )
}

export default RouteTransitionOverlay
