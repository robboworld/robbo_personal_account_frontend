import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import qrcode from 'qrcode-generator'

// A QR code as plain SVG: one path of dark modules with a four-module quiet zone, so it prints
// sharp at any size. The text is an ASCII URL (class page, card link).

const QUIET = 4

export const qrPath = text => {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (qr.isDark(r, c)) d += `M${c + QUIET},${r + QUIET}h1v1h-1z`
    }
  }
  return { d, size: n + QUIET * 2 }
}

const QrCode = ({ text, size = 160, title }) => {
  const { d, size: modules } = useMemo(() => qrPath(text), [text])
  return (
    <svg
      viewBox={`0 0 ${modules} ${modules}`}
      width={size}
      height={size}
      shapeRendering='crispEdges'
      role='img'
      aria-label={title || text}>
      <rect width={modules} height={modules} fill='#fff' />
      <path d={d} fill='#000' />
    </svg>
  )
}

QrCode.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.number,
  title: PropTypes.string,
}

export default QrCode
