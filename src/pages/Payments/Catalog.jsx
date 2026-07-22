import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Empty, List, Typography, message } from 'antd'
import { useIntl } from 'react-intl'

import { checkout, listProducts } from '@/api/payments'

const { Title, Text, Paragraph } = Typography

const formatPrice = (amount, currency, locale) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'RUB',
    }).format(amount)
  } catch (e) {
    return `${amount} ${currency || 'RUB'}`
  }
}

const CatalogPage = () => {
  const intl = useIntl()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await listProducts()
      setProducts(list)
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onBuy = async productId => {
    setBuyingId(productId)
    try {
      const data = await checkout(productId)
      if (!data?.confirmationUrl) {
        throw new Error(intl.formatMessage({ id: 'payments.checkout_no_url' }))
      }
      window.location.href = data.confirmationUrl
    } catch (e) {
      const code = e?.response?.data?.errorCode
      if (code === 'PAYMENT_NOT_CONFIGURED') {
        message.error(intl.formatMessage({ id: 'payments.not_configured' }))
      } else {
        message.error(e?.response?.data?.error || e.message || 'Error')
      }
      setBuyingId(null)
    }
  }

  return (
    <div style={{ maxWidth: 840, margin: '24px auto', padding: '0 16px' }}>
      <Title level={3}>{intl.formatMessage({ id: 'payments.catalog_title' })}</Title>
      <Paragraph type='secondary'>{intl.formatMessage({ id: 'payments.catalog_hint' })}</Paragraph>
      {!loading && products.length === 0 ? (
        <Empty description={intl.formatMessage({ id: 'payments.catalog_empty' })} />
      ) : (
        <List
          loading={loading}
          grid={{ gutter: 16, column: 1 }}
          dataSource={products}
          renderItem={product => (
            <List.Item>
              <Card>
                <Title level={4} style={{ marginTop: 0 }}>
                  {product.title}
                </Title>
                {product.description ? (
                  <Paragraph type='secondary'>{product.description}</Paragraph>
                ) : null}
                <Paragraph>
                  <Text strong>{intl.formatMessage({ id: 'payments.price' })}: </Text>
                  <Text>
                    {formatPrice(product.amount, product.currency, intl.locale)}
                  </Text>
                </Paragraph>
                <Paragraph type='secondary'>
                  {intl.formatMessage(
                    { id: 'payments.product_meta' },
                    {
                      seats: product.seatLimit,
                      days: product.durationDays,
                    },
                  )}
                </Paragraph>
                <Button
                  type='primary'
                  loading={buyingId === product.id}
                  disabled={!!buyingId}
                  onClick={() => onBuy(product.id)}
                >
                  {intl.formatMessage({ id: 'payments.buy' })}
                </Button>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )
}

export default CatalogPage
