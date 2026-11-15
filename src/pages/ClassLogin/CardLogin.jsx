import React, { useEffect, useRef, useState } from 'react'
import { Button, Result, Spin } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { finishKidSignIn } from './index'

import * as api from '@/api/kidLogin'
import { LOGIN_PAGE_ROUTE } from '@/constants'

// A printed QR card opens /c/card#<token>. The token is in the fragment, so proxies and
// Referer never see it; the page takes it out of the address bar before anything else.

const CardLoginPage = () => {
  const intl = useIntl()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const token = window.location.hash.replace(/^#/, '')
    window.history.replaceState(null, '', window.location.pathname)
    if (!token) {
      setFailed(true)
      return
    }
    api
      .loginWithCard(token)
      .then(({ data }) => finishKidSignIn(data))
      .catch(() => setFailed(true))
  }, [])

  if (!failed) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <Spin size='large' />
      </div>
    )
  }
  return (
    <div style={{ padding: '10vh 16px', textAlign: 'center' }}>
      <Result
        status='warning'
        title={intl.formatMessage({ id: 'class_login.card_failed' })}
        extra={
          <Button type='link' onClick={() => window.location.assign(LOGIN_PAGE_ROUTE)}>
            <FormattedMessage id='class_login.usual_login' />
          </Button>
        }
      />
    </div>
  )
}

export default CardLoginPage
