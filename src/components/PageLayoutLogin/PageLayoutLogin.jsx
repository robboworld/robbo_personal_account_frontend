import React from 'react'
import { Button, Divider } from 'antd'

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
            Войти через LMS (OAuth)
          </Button>
          {hybridAuth && (
            <React.Fragment>
              <Divider plain>или</Divider>
              <OidcHint>
                Если OAuth недоступен — войдите email и паролем из LMS (данные из базы openedx).
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
