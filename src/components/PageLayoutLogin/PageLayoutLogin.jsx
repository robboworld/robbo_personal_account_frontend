import React from 'react'
import { Button, Divider } from 'antd'
import { FormattedMessage } from 'react-intl'

import SignInForm from '@/components/SignInForm'
import AuthLayout, {
  AuthFormStyles,
  OidcBlock,
  OidcHint,
} from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'
import { HOME_PAGE_ROUTE } from '@/constants'
import { redirectToOidcStart } from '@/helpers/oidcSession'

const PageLayoutLogin = ({ showOidcLogin = false, hybridAuth = false }) => {
  const actions = useActions({ signInRequest, signUpRequest }, [])

  const handleOidcLogin = () => {
    redirectToOidcStart(HOME_PAGE_ROUTE, 'login')
  }

  return (
    <AuthLayout activeTab='login'>
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

      <AuthFormStyles className='mw-xs mt-3 mb-2'>
        <SignInForm handleSubmit={user => actions.signInRequest(user)} />
      </AuthFormStyles>
    </AuthLayout>
  )
}

export default PageLayoutLogin
