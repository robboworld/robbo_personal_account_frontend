import React, { useEffect, useRef } from 'react'
import { Alert, Button, Divider } from 'antd'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import SignInForm from '@/components/SignInForm'
import { AuthFormStyles, OidcBlock, OidcHint } from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import {
  redirectToOidcStart,
  resolveLoginReturnTo,
} from '@/helpers/oidcSession'

const LoginContent = ({
  showOidcLogin = false,
  hybridAuth = false,
  initialLoginError = null,
  children,
}) => {
  const actions = useActions({ signInRequest, signUpRequest }, [])
  const location = useLocation()
  const params = new URLSearchParams(location.search || '')
  const sessionLimitReached = params.get('err') === 'session_limit_reached'
  const ssoAttempted = params.get('sso_attempted') === '1'
  const silentStarted = useRef(false)

  // Direct /login (e.g. after LMS login): try silent IdP SSO once.
  useEffect(() => {
    if (!showOidcLogin || ssoAttempted || sessionLimitReached || silentStarted.current) {
      return undefined
    }
    if (initialLoginError) {
      return undefined
    }
    silentStarted.current = true
    redirectToOidcStart(resolveLoginReturnTo(location.search), 'none')
    return undefined
  }, [showOidcLogin, ssoAttempted, sessionLimitReached, initialLoginError, location.search])

  if (children) {
    return <React.Fragment>{children}</React.Fragment>
  }

  const startOidc = (kickOtherSessions = false) => {
    redirectToOidcStart(resolveLoginReturnTo(location.search), 'login', kickOtherSessions)
  }

  const showPasswordForm = !showOidcLogin || hybridAuth
  // While auto-redirecting to silent SSO, keep the button visible but avoid double-click noise.
  const awaitingSilent = showOidcLogin && !ssoAttempted && !sessionLimitReached && !initialLoginError

  return (
    <React.Fragment>
      {initialLoginError ? (
        <Alert
          type='error'
          showIcon
          style={{ marginBottom: 16 }}
          message={initialLoginError}
          description={sessionLimitReached ? (
            <Button
              type='primary'
              size='small'
              htmlType='button'
              className='session-limit-kick-btn'
              onClick={() => startOidc(true)}
            >
              <FormattedMessage id='sessions.kick_others' />
            </Button>
          ) : null}
        />
      ) : null}

      {showOidcLogin ? (
        <OidcBlock>
          <Button
            type='primary'
            size='large'
            block
            disabled={awaitingSilent}
            onClick={() => startOidc(false)}
          >
            <FormattedMessage id='auth_login.oidc_button' />
          </Button>
          {hybridAuth ? (
            <React.Fragment>
              <Divider plain>
                <FormattedMessage id='auth_login.or_divider' />
              </Divider>
              <OidcHint>
                <FormattedMessage id='auth_login.oidc_hint' />
              </OidcHint>
            </React.Fragment>
          ) : null}
        </OidcBlock>
      ) : null}

      {showPasswordForm ? (
        <AuthFormStyles className='mw-xs mb-2'>
          <SignInForm handleSubmit={user => actions.signInRequest(user)} />
        </AuthFormStyles>
      ) : null}
    </React.Fragment>
  )
}

LoginContent.propTypes = {
  showOidcLogin: PropTypes.bool,
  hybridAuth: PropTypes.bool,
  initialLoginError: PropTypes.string,
  children: PropTypes.node,
}

export default LoginContent
