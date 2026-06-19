import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate, useOutletContext } from 'react-router-dom'

import AuthLayout from '@/components/AuthLayout'
import LoginContent from '@/components/PageLayoutLogin/PageLayoutLogin'
import RegisterForm from '@/components/RegisterForm'
import {
  backupLoginForm,
  backupRegistrationForm,
} from '@/actions/authForms'
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
  const { pathname } = useLocation()
  const { showOidcLogin, hybridAuth } = useOutletContext()
  const [activeTab, setActiveTab] = useState(() => resolvePageFromPath(pathname))

  const isAuth = useSelector(state => state.login.isAuth)

  useEffect(() => {
    setActiveTab(resolvePageFromPath(pathname))
  }, [pathname])

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

  return (
    <AuthLayout selectedPage={activeTab} onTabSelect={handleOnSelect}>
      {activeTab === LOGIN_PAGE_ROUTE ? (
        <LoginContent showOidcLogin={showOidcLogin} hybridAuth={hybridAuth} />
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  )
}

export default Logistration
