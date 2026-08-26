/**
 * =============================================================================
 * DEV ONLY — easy removal checklist:
 *  1. Delete this file: DevSuperAdminLoginButton.jsx
 *  2. Delete this file: DevSuperAdminLoginButton.css
 *  3. Remove the import + <DevSuperAdminLoginButton /> from AuthLayout.jsx
 * Or set ENABLED = false below.
 * =============================================================================
 */
import React, { useState } from 'react'

import { passwordLoginOidc } from '@/helpers/oidcSession'
import { HOME_PAGE_ROUTE } from '@/constants'

import './DevSuperAdminLoginButton.css'

/** Flip to false to hide without deleting files. */
const ENABLED = true

const DEV_PASSWORD = '123'

/** Identical quick-login buttons (dev only). */
const DEV_ACCOUNTS = [
  { email: 'lms@lms.ru', label: 'Войти как суперадмин (lms@lms.ru)' },
  { email: 'admin@mail.ru', label: 'Войти как суперадмин (admin@mail.ru)' },
  { email: 'megaassik@mail.ru', label: 'Войти как megaassik@mail.ru' },
  { email: '1@1.ru', label: 'Войти как ученик (1@1.ru)' },
]

const DevSuperAdminLoginButton = () => {
  const [busyEmail, setBusyEmail] = useState('')
  const [error, setError] = useState('')

  if (!ENABLED) {
    return null
  }

  const handleClick = async email => {
    if (busyEmail) {
      return
    }
    setError('')
    setBusyEmail(email)
    try {
      const result = await passwordLoginOidc(email, DEV_PASSWORD, HOME_PAGE_ROUTE)
      if (!result.ok) {
        setError(`${email}: ${result.error || 'login_failed'}`)
        setBusyEmail('')
        return
      }
      window.location.assign(HOME_PAGE_ROUTE)
    } catch {
      setError(`${email}: login_failed`)
      setBusyEmail('')
    }
  }

  return (
    <div className='dev-superadmin-login' data-dev-only='superadmin-login'>
      <div className='dev-superadmin-login__stack'>
        {DEV_ACCOUNTS.map(account => (
          <button
            key={account.email}
            type='button'
            className='dev-superadmin-login__btn'
            onClick={() => handleClick(account.email)}
            disabled={Boolean(busyEmail)}
          >
            {busyEmail === account.email ? 'Вход…' : account.label}
          </button>
        ))}
      </div>
      {error ? (
        <p className='dev-superadmin-login__error'>{error}</p>
      ) : null}
    </div>
  )
}

export default DevSuperAdminLoginButton
