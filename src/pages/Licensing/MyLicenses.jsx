import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Empty, Progress, Spin, Typography, message, Popconfirm } from 'antd'
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
  UsageHeader,
  TariffBadge,
  UsageGrid,
  UsageMeter,
  UsageMeterTop,
  UsageMeterLabel,
  UsageMeterValue,
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
import { listMyLicenses, revokeSeat, getEntitlements } from '@/api/licensing'
import { checkout, listProducts } from '@/api/payments'
import { authAPI } from '@/api/auth'

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

const bytesToMb = bytes => (Number(bytes) || 0) / (1024 * 1024)

const meterPercent = (used, limit) => {
  if (!limit || limit <= 0) {
    return 0
  }
  return Math.min(100, Math.round((used / limit) * 100))
}

const meterStatus = percent => {
  if (percent >= 95) return 'exception'
  if (percent >= 80) return 'active'
  return 'normal'
}

const UsageWidget = ({ entitlements, licenses, activeSessions, intl }) => {
  const quotaMb = Number(entitlements.cloudQuotaMb) || 0
  const usedMb = bytesToMb(entitlements.usedBytes)
  const cloudPercent = meterPercent(usedMb, quotaMb)

  const seatLimit = Number(entitlements.seatLimit) || 0
  const seatsUsed = useMemo(
    () => (licenses || []).reduce((sum, lic) => sum + ((lic.seats && lic.seats.length) || 0), 0),
    [licenses],
  )
  const seatsPercent = meterPercent(seatsUsed, seatLimit)

  const sessionLimit = Number(entitlements.sessionLimit) || 0
  const sessionsUnlimited = sessionLimit <= 0
  const sessionsPercent = sessionsUnlimited ? 0 : meterPercent(activeSessions, sessionLimit)

  return (
    <GlassPanel>
      <UsageHeader>
        <SectionTitle style={{ margin: 0 }}>
          {intl.formatMessage({ id: 'licensing.usage_title' })}
        </SectionTitle>
        <TariffBadge>
          {intl.formatMessage(
            { id: 'licensing.usage_tariff' },
            { tariff: entitlements.tariffName || 'Free' },
          )}
        </TariffBadge>
      </UsageHeader>

      <UsageGrid>
        <UsageMeter>
          <UsageMeterTop>
            <UsageMeterLabel>
              {intl.formatMessage({ id: 'licensing.cloud_quota' })}
            </UsageMeterLabel>
            <UsageMeterValue>
              {quotaMb <= 0
                ? intl.formatMessage({ id: 'licensing.unlimited' })
                : intl.formatMessage(
                  { id: 'licensing.usage_cloud_value' },
                  {
                    used: usedMb < 10 ? usedMb.toFixed(1) : Math.round(usedMb),
                    quota: quotaMb,
                  },
                )}
            </UsageMeterValue>
          </UsageMeterTop>
          <Progress
            percent={quotaMb <= 0 ? 0 : cloudPercent}
            status={quotaMb <= 0 ? 'normal' : meterStatus(cloudPercent)}
            showInfo={quotaMb > 0}
            strokeColor={quotaMb > 0 && cloudPercent >= 95 ? undefined : '#0f766e'}
          />
        </UsageMeter>

        <UsageMeter>
          <UsageMeterTop>
            <UsageMeterLabel>
              {intl.formatMessage({ id: 'licensing.session_limit' })}
            </UsageMeterLabel>
            <UsageMeterValue>
              {sessionsUnlimited
                ? intl.formatMessage({ id: 'licensing.unlimited' })
                : intl.formatMessage(
                  { id: 'licensing.usage_count_value' },
                  { used: activeSessions, limit: sessionLimit },
                )}
            </UsageMeterValue>
          </UsageMeterTop>
          <Progress
            percent={sessionsUnlimited ? 0 : sessionsPercent}
            status={sessionsUnlimited ? 'normal' : meterStatus(sessionsPercent)}
            showInfo={!sessionsUnlimited}
            strokeColor={!sessionsUnlimited && sessionsPercent >= 95 ? undefined : '#0f766e'}
          />
        </UsageMeter>

        <UsageMeter>
          <UsageMeterTop>
            <UsageMeterLabel>
              {intl.formatMessage({ id: 'licensing.devices' })}
            </UsageMeterLabel>
            <UsageMeterValue>
              {seatLimit <= 0
                ? intl.formatMessage({ id: 'licensing.unlimited' })
                : intl.formatMessage(
                  { id: 'licensing.usage_count_value' },
                  { used: seatsUsed, limit: seatLimit },
                )}
            </UsageMeterValue>
          </UsageMeterTop>
          <Progress
            percent={seatLimit <= 0 ? 0 : seatsPercent}
            status={seatLimit <= 0 ? 'normal' : meterStatus(seatsPercent)}
            showInfo={seatLimit > 0}
            strokeColor={seatLimit > 0 && seatsPercent >= 95 ? undefined : '#0f766e'}
          />
        </UsageMeter>
      </UsageGrid>
    </GlassPanel>
  )
}

const MyLicensesPage = () => {
  const intl = useIntl()
  const [licenses, setLicenses] = useState([])
  const [products, setProducts] = useState([])
  const [entitlements, setEntitlements] = useState(null)
  const [activeSessions, setActiveSessions] = useState(0)
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

  const loadUsage = useCallback(async () => {
    try {
      const [ent, sessionsRes] = await Promise.all([
        getEntitlements(),
        authAPI.listSessions().catch(() => ({ data: { sessions: [] } })),
      ])
      setEntitlements(ent)
      setActiveSessions((sessionsRes?.data?.sessions || []).length)
    } catch (e) {
      // Non-fatal for the page; usage widget just stays empty.
    }
  }, [])

  useEffect(() => {
    loadLicenses()
    loadProducts()
    loadUsage()
  }, [loadLicenses, loadProducts, loadUsage])

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
      loadUsage()
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

        {entitlements ? (
          <motion.div variants={staggerItem}>
            <UsageWidget
              entitlements={entitlements}
              licenses={licenses}
              activeSessions={activeSessions}
              intl={intl}
            />
          </motion.div>
        ) : null}

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
                      {intl.formatMessage({ id: 'licensing.cloud_quota' })}
                      {': '}
                      {lic.cloudQuotaMb ?? '—'}
                      {' MB · '}
                      {intl.formatMessage({ id: 'licensing.session_limit' })}
                      {': '}
                      {lic.sessionLimit === 0
                        ? intl.formatMessage({ id: 'licensing.unlimited' })
                        : (lic.sessionLimit ?? '—')}
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
                          cloudMb: product.cloudQuotaMb ?? 10,
                          sessions: product.sessionLimit ?? 0,
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
