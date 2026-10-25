import React from 'react'
import { Alert } from 'antd'
import { useIntl } from 'react-intl'

import config from '@/config'

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]', '::1'])

/** Backend host the bundle talks to, when it differs in kind from the page host. */
export function prodApiOnLocalhost(pageHost, backendUrl) {
  if (!LOOPBACK.has(pageHost)) return null
  try {
    const apiHost = new URL(backendUrl).hostname
    return LOOPBACK.has(apiHost) ? null : apiHost
  } catch {
    return null
  }
}

// A release bundle has the production API baked in. Run on a developer machine it looks like
// a local stand while every click writes to production; make that impossible to miss.
const ProdBuildWarning = () => {
  const intl = useIntl()
  const host =
    typeof window === 'undefined'
      ? null
      : prodApiOnLocalhost(window.location.hostname, (config.backendURL || [])[0])
  if (!host) return null
  return (
    <Alert
      type='error'
      banner
      showIcon
      style={{ position: 'sticky', top: 0, zIndex: 2000 }}
      title={intl.formatMessage({ id: 'prod_build_warning.title' }, { host })}
    />
  )
}

export default ProdBuildWarning
