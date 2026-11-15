import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input, Spin, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import * as api from '@/api/kidLogin'
import { LANDING_PAGE_ROUTE } from '@/constants'

const { Title, Text } = Typography

// The short address for school laptops whose browser is wiped after every lesson: /k and the
// six digits on the teacher's projector open the class page (architecture/ADR_CLASS_KID_LOGIN.md).
// /k/<code> is the same from a tablet that scanned the projector QR.

const CODE_LENGTH = 6

const CodeEntryPage = () => {
  const { code: codeFromPath } = useParams()
  const navigate = useNavigate()
  const intl = useIntl()
  const [code, setCode] = useState('')
  const [state, setState] = useState('idle') // idle | checking | wrong | busy
  const inputRef = useRef(null)

  const lookup = useCallback(
    async value => {
      setState('checking')
      try {
        const { data } = await api.getRoomByCode(value)
        navigate(data.classPage, { replace: true })
      } catch (e) {
        setState(e?.response?.status === 429 ? 'busy' : 'wrong')
        setCode('')
        inputRef.current?.focus()
      }
    },
    [navigate],
  )

  useEffect(() => {
    document.title = intl.formatMessage({ id: 'class_login.code_title' })
  }, [intl])

  useEffect(() => {
    if (codeFromPath && /^\d{6}$/.test(codeFromPath)) lookup(codeFromPath)
  }, [codeFromPath, lookup])

  const onChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)
    setCode(digits)
    if (state !== 'checking') setState('idle')
    if (digits.length === CODE_LENGTH) lookup(digits)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '12vh 16px 48px',
        background: '#f5f9ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
      <Title level={2}>
        <FormattedMessage id='class_login.code_title' />
      </Title>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>
        <FormattedMessage id='class_login.code_hint' />
      </Text>
      <Spin spinning={state === 'checking'}>
        <Input
          ref={inputRef}
          autoFocus
          value={code}
          onChange={onChange}
          inputMode='numeric'
          autoComplete='off'
          maxLength={CODE_LENGTH}
          aria-label={intl.formatMessage({ id: 'class_login.code_title' })}
          placeholder='000000'
          style={{
            width: 300,
            maxWidth: '100%',
            fontSize: 48,
            textAlign: 'center',
            letterSpacing: '0.2em',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      </Spin>
      {state === 'wrong' ? (
        <Text type='danger' style={{ fontSize: 20, marginTop: 16 }}>
          <FormattedMessage id='class_login.code_wrong' />
        </Text>
      ) : null}
      {state === 'busy' ? (
        <Text type='warning' style={{ fontSize: 20, marginTop: 16 }}>
          <FormattedMessage id='class_login.busy' />
        </Text>
      ) : null}
      {/* Back to the landing, where "Вход в класс" brought them from. */}
      <Link to={LANDING_PAGE_ROUTE} style={{ marginTop: 32, fontSize: 16 }}>
        <ArrowLeftOutlined /> <FormattedMessage id='class_login.to_home' />
      </Link>
    </div>
  )
}

export default CodeEntryPage
