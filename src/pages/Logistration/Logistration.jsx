import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate, useOutletContext } from 'react-router-dom'

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
  const { oidcStatus } = useOutletContext()
  const [activeTab, setActiveTab] = useState(() => resolvePageFromPath(location.pathname))
  const showLocalAuthForms = shouldShowLocalAuthForms(oidcStatus)

  const isAuth = useSelector(state => state.login.isAuth)

  useEffect(() => {
    setActiveTab(resolvePageFromPath(location.pathname))
  }, [location.pathname])

  useEffect(() => {
    if (showLocalAuthForms) {
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
  }, [activeTab, location.search, showLocalAuthForms])

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

  if (!showLocalAuthForms) {
    return <Loader />
  }

  return (
    <AuthLayout selectedPage={activeTab} onTabSelect={handleOnSelect}>
      {activeTab === LOGIN_PAGE_ROUTE ? (
        <LoginContent />
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  )
}

export default Logistration
