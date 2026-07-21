import React from 'react'
import PropTypes from 'prop-types'

import SignInForm from '@/components/SignInForm'
import { AuthFormStyles } from '@/components/AuthLayout'
import { useActions } from '@/helpers'
import { signInRequest, signUpRequest } from '@/actions'

const LoginContent = ({ children }) => {
  const actions = useActions({ signInRequest, signUpRequest }, [])

  if (children) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return (
    <AuthFormStyles className='mw-xs mb-2'>
      <SignInForm handleSubmit={user => actions.signInRequest(user)} />
    </AuthFormStyles>
  )
}

LoginContent.propTypes = {
  children: PropTypes.node,
}

export default LoginContent
