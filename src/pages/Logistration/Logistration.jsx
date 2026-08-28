import React, { useEffect, useState } from 'react'
import { Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import { useIntl } from 'react-intl'

import AuthLayout from '@/components/AuthLayout'
import Loader from '@/components/Loader'
import LoginContent from '@/components/PageLayoutLogin/PageLayoutLogin'
import RegisterForm from '@/components/RegisterForm'
import {
  backupLoginForm,
  backupRegistrationForm,
} from '@/actions/authForms'
import {
  formatInactiveBanDescription,
  parseInactiveLoginSearch,
} from '@/helpers/inactiveLogin'
import {
  redirectToOidcStart,
  resolveLoginReturnTo,
} from '@/helpers/oidcSession'
import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  REGISTER_PAGE_ROUTE,
} from '@/constants'

const resolvePageFromPath = pathname => (
  pathname === LOGIN_PAGE_ROUTE ? LOGIN_PAGE_ROUTE : REGISTER_PAGE_ROUTE
)

const parseLoginQueryError = (search, intl) => {
  const params = new URLSearchParams(search || '')
  const err = params.get('err')
  if (!err || err === 'user_inactive') {
    return null
  }
  const keyByErr = {
    user_not_found: 'login.error.user_not_found',
    invalid_credentials: 'login.error.invalid_credentials',
    session_limit_reached: 'sessions.limit_reached',
  }
  const id = keyByErr[err] || 'login.error.generic'
  return intl.formatMessage({ id })
}

const Logistration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const intl = useIntl()
  const { showOidcLogin = false, hybridAuth = false } = useOutletContext() || {}
  const [activeTab, setActiveTab] = useState(() => resolvePageFromPath(location.pathname))
  const inactiveBan = parseInactiveLoginSearch(location.search)
  const queryLoginError = parseLoginQueryError(location.search, intl)

  const isAuth = useSelector(state => state.login.isAuth)
  const stayOnLoginForOidcError = Boolean(inactiveBan || queryLoginError)
  const redirectLoginToMock = (
    showOidcLogin &&
    activeTab === LOGIN_PAGE_ROUTE &&
    !stayOnLoginForOidcError
  )

  useEffect(() => {
    setActiveTab(resolvePageFromPath(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    if (!redirectLoginToMock) {
      return undefined
    }
    redirectToOidcStart(resolveLoginReturnTo(location.search), 'login')
    return undefined
  }, [redirectLoginToMock, location.search])

  const handleOnSelect = tabKey => {
    if (tabKey === activeTab) {
      return
    }

    if (tabKey === LOGIN_PAGE_ROUTE) {
      dispatch(backupRegistrationForm())
    } else if (tabKey === REGISTER_PAGE_ROUTE) {
      dispatch(backupLoginForm())
    }

    setActiveTab(tabKey)
    const params = new URLSearchParams(location.search)
    const join = params.get('join')
    navigate(join ? `${tabKey}?join=${encodeURIComponent(join)}` : tabKey, { replace: true })
  }

  if (isAuth && localStorage.getItem('token')) {
    const params = new URLSearchParams(location.search)
    const join = params.get('join')
    if (join) {
      return <Navigate to={`/join?code=${encodeURIComponent(join)}`} replace />
    }
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  if (redirectLoginToMock) {
    return <Loader />
  }

  const inactiveAlert = inactiveBan ? (
    <Alert
      type='error'
      showIcon
      style={{ marginBottom: 16, whiteSpace: 'pre-line' }}
      message={intl.formatMessage({ id: 'login.inactive.heading' })}
      description={formatInactiveBanDescription(intl, inactiveBan)}
    />
  ) : null

  return (
    <AuthLayout selectedPage={activeTab} onTabSelect={handleOnSelect}>
      {activeTab === LOGIN_PAGE_ROUTE ? (
        <React.Fragment>
          {inactiveAlert}
          <LoginContent
            showOidcLogin={showOidcLogin}
            hybridAuth={hybridAuth}
            initialLoginError={queryLoginError}
          />
        </React.Fragment>
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  )
}

export default Logistration
