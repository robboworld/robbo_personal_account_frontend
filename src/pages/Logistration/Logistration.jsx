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
  redirectToLmsRegister,
  redirectToOidcStart,
  resolveLoginReturnTo,
  shouldShowLocalAuthForms,
} from '@/helpers/oidcSession'
import {
  formatInactiveBanDescription,
  parseInactiveLoginSearch,
} from '@/helpers/inactiveLogin'
import {
  HOME_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  REGISTER_PAGE_ROUTE,
} from '@/constants'

const resolvePageFromPath = pathname => (
  pathname === LOGIN_PAGE_ROUTE ? LOGIN_PAGE_ROUTE : REGISTER_PAGE_ROUTE
)

const Logistration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const intl = useIntl()
  const { oidcStatus } = useOutletContext()
  const [activeTab, setActiveTab] = useState(() => resolvePageFromPath(location.pathname))
  const showLocalAuthForms = shouldShowLocalAuthForms(oidcStatus)
  const inactiveBan = parseInactiveLoginSearch(location.search)

  const isAuth = useSelector(state => state.login.isAuth)

  useEffect(() => {
    setActiveTab(resolvePageFromPath(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    if (showLocalAuthForms) {
      return undefined
    }

    // Stay on login to show ban reason instead of bouncing back to IdP.
    if (inactiveBan) {
      return undefined
    }

    if (activeTab === LOGIN_PAGE_ROUTE) {
      redirectToOidcStart(resolveLoginReturnTo(location.search), 'login')
      return undefined
    }

    if (activeTab === REGISTER_PAGE_ROUTE) {
      redirectToLmsRegister()
    }

    return undefined
  }, [activeTab, location.search, showLocalAuthForms, inactiveBan])

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
    navigate(tabKey, { replace: true })
  }

  if (isAuth && localStorage.getItem('token')) {
    return <Navigate to={HOME_PAGE_ROUTE} replace />
  }

  if (!showLocalAuthForms && !inactiveBan) {
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
          {showLocalAuthForms ? <LoginContent /> : null}
        </React.Fragment>
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  )
}

export default Logistration
