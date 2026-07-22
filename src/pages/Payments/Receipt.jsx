import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Spin, Typography } from 'antd'
import { Link, useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'

import { getOrder } from '@/api/payments'
import { MY_LICENSES_ROUTE } from '@/constants'

const { Title, Paragraph, Text } = Typography

const POLL_MS = 3000
const MAX_POLLS = 20

const ReceiptPage = () => {
  const intl = useIntl()
  const [params] = useSearchParams()
  const orderNumber = (params.get('order_number') || params.get('orderNumber') || '').trim()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const pollsRef = useRef(0)
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    if (!orderNumber) {
      setError(intl.formatMessage({ id: 'payments.receipt_missing_order' }))
      setLoading(false)
      return
    }
    try {
      const data = await getOrder(orderNumber)
      setOrder(data)
      setError(null)
      setLoading(false)
      if (data?.status === 'pending' && pollsRef.current < MAX_POLLS) {
        pollsRef.current += 1
        timerRef.current = setTimeout(load, POLL_MS)
      }
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Error')
      setLoading(false)
    }
  }, [orderNumber, intl])

  useEffect(() => {
    pollsRef.current = 0
    load()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [load])

  const status = order?.status
  let alertType = 'info'
  let statusMessage = intl.formatMessage({ id: 'payments.status_pending' })
  if (status === 'paid') {
    alertType = 'success'
    statusMessage = intl.formatMessage({ id: 'payments.status_paid' })
  } else if (status === 'canceled') {
    alertType = 'warning'
    statusMessage = intl.formatMessage({ id: 'payments.status_canceled' })
  } else if (status === 'failed') {
    alertType = 'error'
    statusMessage = intl.formatMessage({ id: 'payments.status_failed' })
  } else if (status === 'refunded') {
    alertType = 'warning'
    statusMessage = intl.formatMessage({ id: 'payments.status_refunded' })
  }

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: '0 16px' }}>
      <Title level={3}>{intl.formatMessage({ id: 'payments.receipt_title' })}</Title>
      {loading && !order ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin />
        </div>
      ) : null}
      {error ? <Alert type='error' showIcon
message={error} /> : null}
      {order ? (
        <Card style={{ marginTop: 16 }}>
          <Alert type={alertType} showIcon
message={statusMessage} style={{ marginBottom: 16 }} />
          <Paragraph>
            <Text strong>{intl.formatMessage({ id: 'payments.order_number' })}: </Text>
            <Text code copyable>{order.orderNumber}</Text>
          </Paragraph>
          <Paragraph>
            <Text strong>{intl.formatMessage({ id: 'payments.price' })}: </Text>
            {order.amount} {order.currency}
          </Paragraph>
          {status === 'paid' ? (
            <Link to={MY_LICENSES_ROUTE}>
              <Button type='primary'>
                {intl.formatMessage({ id: 'payments.go_to_licenses' })}
              </Button>
            </Link>
          ) : null}
          {status === 'pending' ? (
            <Paragraph type='secondary' style={{ marginTop: 12 }}>
              {intl.formatMessage({ id: 'payments.receipt_polling' })}
            </Paragraph>
          ) : null}
        </Card>
      ) : null}
    </div>
  )
}

export default ReceiptPage
