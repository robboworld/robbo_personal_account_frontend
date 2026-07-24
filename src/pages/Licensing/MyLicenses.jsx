import React, { useCallback, useEffect, useState } from 'react'
import { Button, Empty, Spin, Typography, message, Popconfirm } from 'antd'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import {
  LicenseCard,
  LicenseKeyRow,
  LicenseLabel,
  LicenseMeta,
  LicenseStack,
  ProductTitle,
  ProductActions,
  SeatInfo,
  SeatItem,
  SeatList,
} from './styles'

import {
  GlassPanel,
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  SectionHeader,
  SectionHint,
  SectionTitle,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { listMyLicenses, revokeSeat } from '@/api/licensing'
import { checkout, listProducts } from '@/api/payments'

const { Text } = Typography

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

const MyLicensesPage = () => {
  const intl = useIntl()
  const [licenses, setLicenses] = useState([])
  const [products, setProducts] = useState([])
  const [licensesLoading, setLicensesLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [buyingId, setBuyingId] = useState(null)

  const loadLicenses = useCallback(async () => {
    setLicensesLoading(true)
    try {
      const list = await listMyLicenses()
      setLicenses(list)
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLicensesLoading(false)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const list = await listProducts()
      setProducts(list)
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setProductsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLicenses()
    loadProducts()
  }, [loadLicenses, loadProducts])

  useEffect(() => {
    if (window.location.hash !== '#buy') {
      return undefined
    }
    const el = document.getElementById('buy')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return undefined
  }, [productsLoading])

  const onRevoke = async (licenseId, seatId) => {
    try {
      await revokeSeat(licenseId, seatId)
      message.success(intl.formatMessage({ id: 'licensing.seat_revoked' }))
      loadLicenses()
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    }
  }

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
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              {intl.formatMessage({ id: 'licensing.my_title' })}
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'licensing.my_hint' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            {licensesLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Spin />
              </div>
            ) : licenses.length === 0 ? (
              <Empty description={intl.formatMessage({ id: 'licensing.my_empty' })} />
            ) : (
              <LicenseStack>
                {licenses.map(lic => (
                  <LicenseCard key={lic.id}>
                    <LicenseKeyRow>
                      <LicenseLabel>
                        {intl.formatMessage({ id: 'licensing.license_key' })}
                      </LicenseLabel>
                      <Text code copyable>{lic.licenseKey}</Text>
                    </LicenseKeyRow>
                    <LicenseMeta>
                      {lic.status}
                      {' · seats '}
                      {lic.seats?.length || 0}
                      /
                      {lic.seatLimit}
                      {' · '}
                      {intl.formatMessage({ id: 'licensing.expires_at' })}
                      {': '}
                      {lic.expiresAt}
                    </LicenseMeta>
                    {(lic.seats || []).length === 0 ? (
                      <Text type='secondary'>
                        {intl.formatMessage({ id: 'licensing.no_seats' })}
                      </Text>
                    ) : (
                      <SeatList>
                        {(lic.seats || []).map(seat => (
                          <SeatItem key={seat.seatId}>
                            <SeatInfo>
                              <Text code>{seat.seatId}</Text>
                              <Text type='secondary'>
                                {seat.deviceFingerprint?.slice(0, 12)}
                                …
                              </Text>
                            </SeatInfo>
                            <Popconfirm
                              title={intl.formatMessage({ id: 'licensing.revoke_confirm' })}
                              onConfirm={() => onRevoke(lic.id, seat.seatId)}
                            >
                              <Button danger size='small'>
                                {intl.formatMessage({ id: 'licensing.revoke_seat' })}
                              </Button>
                            </Popconfirm>
                          </SeatItem>
                        ))}
                      </SeatList>
                    )}
                  </LicenseCard>
                ))}
              </LicenseStack>
            )}
          </GlassPanel>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassPanel id='buy'>
            <SectionHeader>
              <SectionTitle>
                {intl.formatMessage({ id: 'payments.catalog_title' })}
              </SectionTitle>
              <SectionHint>
                {intl.formatMessage({ id: 'payments.catalog_hint' })}
              </SectionHint>
            </SectionHeader>
            {productsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Spin />
              </div>
            ) : products.length === 0 ? (
              <Empty description={intl.formatMessage({ id: 'payments.catalog_empty' })} />
            ) : (
              <LicenseStack>
                {products.map(product => (
                  <LicenseCard key={product.id}>
                    <ProductTitle>{product.title}</ProductTitle>
                    {product.description ? (
                      <LicenseMeta>{product.description}</LicenseMeta>
                    ) : null}
                    <LicenseMeta>
                      <Text strong>
                        {intl.formatMessage({ id: 'payments.price' })}
                        {': '}
                      </Text>
                      {formatPrice(product.amount, product.currency, intl.locale)}
                      {' · '}
                      {intl.formatMessage(
                        { id: 'payments.product_meta' },
                        {
                          seats: product.seatLimit,
                          days: product.durationDays,
                        },
                      )}
                    </LicenseMeta>
                    <ProductActions>
                      <Button
                        type='primary'
                        loading={buyingId === product.id}
                        disabled={!!buyingId}
                        onClick={() => onBuy(product.id)}
                      >
                        {intl.formatMessage({ id: 'payments.buy' })}
                      </Button>
                    </ProductActions>
                  </LicenseCard>
                ))}
              </LicenseStack>
            )}
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default MyLicensesPage
