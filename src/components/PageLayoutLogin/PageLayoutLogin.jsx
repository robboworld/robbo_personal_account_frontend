import React from 'react'
import { Button, Divider } from 'antd'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import SignInForm from '@/components/SignInForm'
import { AuthFormStyles, OidcBlock, OidcHint } from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import { HOME_PAGE_ROUTE } from '@/constants'
import { redirectToOidcStart } from '@/helpers/oidcSession'

const LoginContent = ({ showOidcLogin = false, hybridAuth = false }) => {
  const actions = useActions({ signInRequest, signUpRequest }, [])

  const handleOidcLogin = () => {
    redirectToOidcStart(HOME_PAGE_ROUTE, 'login')
  }

  return (
    <React.Fragment>
      {showOidcLogin && (
        <OidcBlock>
          <Button
            type='primary'
            size='large'
            block
            onClick={handleOidcLogin}
          >
            <FormattedMessage id='auth_login.oidc_button' />
          </Button>
          {hybridAuth && (
            <React.Fragment>
              <Divider plain>
                <FormattedMessage id='auth_login.or_divider' />
              </Divider>
              <OidcHint>
                <FormattedMessage id='auth_login.oidc_hint' />
              </OidcHint>
            </React.Fragment>
          )}
        </OidcBlock>
      )}

      <AuthFormStyles className='mw-xs mb-2'>
        <SignInForm handleSubmit={user => actions.signInRequest(user)} />
      </AuthFormStyles>
    </React.Fragment>
  )
}

LoginContent.propTypes = {
  showOidcLogin: PropTypes.bool,
  hybridAuth: PropTypes.bool,
}

export default LoginContent
