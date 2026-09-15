import React from 'react'
import { Alert, Button, Space } from 'antd'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import {
  lmsRegisterUrl,
  parseOidcCallbackError,
  redirectToOidcLogin,
  stripOidcErrorParams,
} from '@/helpers/oidcSession'

const shellStyle = {
  minHeight: '60vh',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
}

const panelStyle = {
  width: '100%',
  maxWidth: 440,
}

const OidcAuthErrorFallback = ({ search, inactiveAlert }) => {
  const intl = useIntl()
  const message = parseOidcCallbackError(search, intl) ||
    intl.formatMessage({ id: 'login.error.generic' })

  const handleRetry = () => {
    redirectToOidcLogin(stripOidcErrorParams(search), 'login')
  }

  return (
    <div style={shellStyle}>
      <div style={panelStyle}>
        {inactiveAlert}
        {!inactiveAlert && (
          <Alert type='error' showIcon
message={message} style={{ marginBottom: 16 }} />
        )}
        <Space direction='vertical' style={{ width: '100%' }}
size='middle'>
          <Button type='primary' size='large'
block onClick={handleRetry}>
            {intl.formatMessage({ id: 'login.oidc.retry_button' })}
          </Button>
          <Button size='large' block
href={lmsRegisterUrl()}>
            {intl.formatMessage({ id: 'login.oidc.register_on_lms' })}
          </Button>
        </Space>
      </div>
    </div>
  )
}

OidcAuthErrorFallback.propTypes = {
  search: PropTypes.string,
  inactiveAlert: PropTypes.node,
}

OidcAuthErrorFallback.defaultProps = {
  search: '',
  inactiveAlert: null,
}

export default OidcAuthErrorFallback
