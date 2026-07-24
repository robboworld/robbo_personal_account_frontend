import React, { useEffect, useRef, useState } from 'react'
import { AutoComplete, Spin } from 'antd'
import { useIntl } from 'react-intl'

import { searchLmsUsers } from '@/api/users'

function formatOption(item) {
  const email = item.email ? ` (${item.email})` : ''
  const name = item.fullName ? ` — ${item.fullName}` : ''
  return {
    value: item.username,
    label: `${item.username}${email}${name}`,
  }
}

/**
 * Debounced LMS username AutoComplete for admin forms.
 */
const LmsUsernameSelect = ({ value, onChange, id, disabled }) => {
  const intl = useIntl()
  const [options, setOptions] = useState([])
  const [fetching, setFetching] = useState(false)
  const timerRef = useRef(null)
  const reqRef = useRef(0)

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  const onSearch = text => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    const q = String(text || '').trim()
    if (!q) {
      setOptions([])
      setFetching(false)
      return
    }
    setFetching(true)
    const reqId = ++reqRef.current
    timerRef.current = setTimeout(async () => {
      try {
        const items = await searchLmsUsers(q, 20)
        if (reqId !== reqRef.current) {
          return
        }
        setOptions(items.map(formatOption))
      } catch {
        if (reqId === reqRef.current) {
          setOptions([])
        }
      } finally {
        if (reqId === reqRef.current) {
          setFetching(false)
        }
      }
    }, 300)
  }

  return (
    <AutoComplete
      id={id}
      value={value}
      options={options}
      onSearch={onSearch}
      onChange={onChange}
      disabled={disabled}
      allowClear
      filterOption={false}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      placeholder={intl.formatMessage({ id: 'lms_username.placeholder' })}
      style={{ width: '100%' }}
    />
  )
}

export default LmsUsernameSelect
