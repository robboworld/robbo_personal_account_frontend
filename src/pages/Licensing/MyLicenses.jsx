import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Empty, Progress, Spin, Typography, message, Popconfirm } from 'antd'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import {
  EmptyDevices,
  EmptyDevicesActions,
  EmptyDevicesText,
  EmptyDevicesTitle,
  KeyBlock,
  KeyBlockLabel,
  LicenseKeyRow,
  LicenseLabel,
  LicenseStack,
  PanelSectionTitle,
  ProductActions,
  ProductCard,
  ProductCardHeader,
  ProductFeature,
  ProductFeatures,
  ProductGrid,
  ProductPrice,
  ProductTitle,
  SeatInfo,
  SeatItem,
  SeatList,
  SessionsLink,
  SplitGrid,
  StatusHint,
  StatusPills,
  StatusTitle,
  TariffBadge,
  UsageHeader,
  UsageMeter,
  UsageMeterLabel,
  UsageMeterTop,
  UsageMeterValue,
  UsageStack,
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
import { MY_SESSIONS_ROUTE } from '@/constants/router'

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

const formatExpiresAt = (iso, locale) => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch (e) {
    return iso
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

const isLicenseActive = lic => {
  const status = String(lic?.status || '').toLowerCase()
  if (status && status !== 'active') return false
  if (!lic?.expiresAt) return status === 'active'
  const expires = new Date(lic.expiresAt)
  if (Number.isNaN(expires.getTime())) return status === 'active'
  return expires.getTime() > Date.now()
}

const UsageColumn = ({ entitlements, seatsUsed, activeSessions, intl }) => {
  const quotaMb = Number(entitlements.cloudQuotaMb) || 0
  const usedMb = bytesToMb(entitlements.usedBytes)
  const cloudPercent = meterPercent(usedMb, quotaMb)

  const seatLimit = Number(entitlements.seatLimit) || 0
  const seatsPercent = meterPercent(seatsUsed, seatLimit)

  const sessionLimit = Number(entitlements.sessionLimit) || 0
  const sessionsUnlimited = sessionLimit <= 0
  const sessionsPercent = sessionsUnlimited ? 0 : meterPercent(activeSessions, sessionLimit)

  return (
    <GlassPanel>
      <UsageHeader>
        <PanelSectionTitle style={{ margin: 0 }}>
          {intl.formatMessage({ id: 'licensing.usage_title' })}
        </PanelSectionTitle>
        <TariffBadge>
          {intl.formatMessage(
            { id: 'licensing.usage_tariff' },
            { tariff: entitlements.tariffName || 'Free' },
          )}
        </TariffBadge>
      </UsageHeader>
      <UsageStack>
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
      </UsageStack>
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
  }, [intl])

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

  const activeLicenses = useMemo(
    () => (licenses || []).filter(isLicenseActive),
    [licenses],
  )

  const primaryLicense = activeLicenses[0] || licenses[0] || null

  const seatsUsed = useMemo(
    () => (licenses || []).reduce((sum, lic) => sum + ((lic.seats && lic.seats.length) || 0), 0),
    [licenses],
  )

  const seatEntries = useMemo(() => {
    const rows = []
    ;(licenses || []).forEach(lic => {
      ;(lic.seats || []).forEach(seat => {
        rows.push({ licenseId: lic.id, licenseKey: lic.licenseKey, seat })
      })
    })
    return rows
  }, [licenses])

  const tariffName = entitlements?.tariffName || 'Free'
  const hasActive = activeLicenses.length > 0
  const seatLimit = Number(entitlements?.seatLimit ?? primaryLicense?.seatLimit) || 0
  const expiresLabel = formatExpiresAt(primaryLicense?.expiresAt, intl.locale)

  const isCurrentProduct = product => {
    if (!hasActive || !product?.title) return false
    return String(product.title).trim().toLowerCase() === String(tariffName).trim().toLowerCase()
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
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                <Spin />
              </div>
            ) : (
              <React.Fragment>
                <StatusTitle>
                  {hasActive
                    ? intl.formatMessage({ id: 'licensing.status_active' })
                    : intl.formatMessage({ id: 'licensing.status_none' })}
                </StatusTitle>
                <StatusPills>
                  <TariffBadge>
                    {intl.formatMessage(
                      { id: 'licensing.usage_tariff' },
                      { tariff: tariffName },
                    )}
                  </TariffBadge>
                  {hasActive && seatLimit > 0 ? (
                    <TariffBadge>
                      {intl.formatMessage(
                        { id: 'licensing.seats_pill' },
                        { used: seatsUsed, limit: seatLimit },
                      )}
                    </TariffBadge>
                  ) : null}
                  {hasActive && expiresLabel ? (
                    <TariffBadge>
                      {intl.formatMessage(
                        { id: 'licensing.expires_pill' },
                        { date: expiresLabel },
                      )}
                    </TariffBadge>
                  ) : null}
                </StatusPills>
                <StatusHint>
                  {intl.formatMessage({ id: 'licensing.status_robbo_id_hint' })}
                </StatusHint>
                {licenses.length === 0 ? (
                  <Empty description={intl.formatMessage({ id: 'licensing.my_empty' })} />
                ) : (
                  <KeyBlock>
                    <KeyBlockLabel>
                      {intl.formatMessage({ id: 'licensing.key_manual_label' })}
                    </KeyBlockLabel>
                    <LicenseStack>
                      {licenses.map(lic => (
                        <LicenseKeyRow key={lic.id} style={{ marginBottom: 0 }}>
                          <LicenseLabel>
                            {intl.formatMessage({ id: 'licensing.license_key' })}
                          </LicenseLabel>
                          <Text code copyable>{lic.licenseKey}</Text>
                        </LicenseKeyRow>
                      ))}
                    </LicenseStack>
                  </KeyBlock>
                )}
              </React.Fragment>
            )}
          </GlassPanel>
        </motion.div>

        <motion.div variants={staggerItem}>
          <SplitGrid>
            <GlassPanel>
              <PanelSectionTitle>
                {intl.formatMessage({ id: 'licensing.devices_title' })}
              </PanelSectionTitle>
              {licensesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 0' }}>
                  <Spin />
                </div>
              ) : seatEntries.length === 0 ? (
                <EmptyDevices>
                  <EmptyDevicesTitle>
                    {intl.formatMessage({ id: 'licensing.no_seats' })}
                  </EmptyDevicesTitle>
                  <EmptyDevicesText>
                    {intl.formatMessage({ id: 'licensing.devices_empty_hint' })}
                  </EmptyDevicesText>
                  <EmptyDevicesActions>
                    <SessionsLink to={MY_SESSIONS_ROUTE}>
                      {intl.formatMessage({ id: 'licensing.devices_sessions_link' })}
                    </SessionsLink>
                  </EmptyDevicesActions>
                </EmptyDevices>
              ) : (
                <SeatList>
                  {seatEntries.map(({ licenseId, seat }) => (
                    <SeatItem key={`${licenseId}-${seat.seatId}`}>
                      <SeatInfo>
                        <Text code>{seat.label || seat.seatId}</Text>
                        {seat.deviceFingerprint ? (
                          <Text type='secondary'>
                            {seat.deviceFingerprint.slice(0, 12)}
                            …
                          </Text>
                        ) : null}
                      </SeatInfo>
                      <Popconfirm
                        title={intl.formatMessage({ id: 'licensing.revoke_confirm' })}
                        onConfirm={() => onRevoke(licenseId, seat.seatId)}
                      >
                        <Button danger size='small'>
                          {intl.formatMessage({ id: 'licensing.revoke_seat' })}
                        </Button>
                      </Popconfirm>
                    </SeatItem>
                  ))}
                </SeatList>
              )}
            </GlassPanel>

            {entitlements ? (
              <UsageColumn
                entitlements={entitlements}
                seatsUsed={seatsUsed}
                activeSessions={activeSessions}
                intl={intl}
              />
            ) : null}
          </SplitGrid>
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
              <ProductGrid>
                {products.map(product => {
                  const current = isCurrentProduct(product)
                  return (
                    <ProductCard key={product.id} $current={current}>
                      <ProductCardHeader>
                        <ProductTitle style={{ margin: 0 }}>{product.title}</ProductTitle>
                        {current ? (
                          <TariffBadge>
                            {intl.formatMessage({ id: 'payments.current_plan' })}
                          </TariffBadge>
                        ) : null}
                      </ProductCardHeader>
                      {product.description ? (
                        <Text type='secondary' style={{ display: 'block', marginBottom: '0.65rem' }}>
                          {product.description}
                        </Text>
                      ) : null}
                      <ProductPrice>
                        {formatPrice(product.amount, product.currency, intl.locale)}
                      </ProductPrice>
                      <ProductFeatures>
                        <ProductFeature>
                          {intl.formatMessage(
                            { id: 'payments.feature_cloud' },
                            { cloudMb: product.cloudQuotaMb ?? 10 },
                          )}
                        </ProductFeature>
                        <ProductFeature>
                          {intl.formatMessage(
                            { id: 'payments.feature_devices' },
                            { seats: product.seatLimit },
                          )}
                        </ProductFeature>
                        <ProductFeature>
                          {(product.sessionLimit ?? 0) <= 0
                            ? intl.formatMessage({ id: 'payments.feature_sessions_unlimited' })
                            : intl.formatMessage(
                              { id: 'payments.feature_sessions' },
                              { sessions: product.sessionLimit },
                            )}
                        </ProductFeature>
                        <ProductFeature>
                          {intl.formatMessage(
                            { id: 'payments.feature_days' },
                            { days: product.durationDays },
                          )}
                        </ProductFeature>
                      </ProductFeatures>
                      <ProductActions>
                        <Button
                          type={current ? 'default' : 'primary'}
                          loading={buyingId === product.id}
                          disabled={!!buyingId || current}
                          onClick={() => onBuy(product.id)}
                        >
                          {current
                            ? intl.formatMessage({ id: 'payments.already_connected' })
                            : intl.formatMessage({ id: 'payments.buy' })}
                        </Button>
                      </ProductActions>
                    </ProductCard>
                  )
                })}
              </ProductGrid>
            )}
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default MyLicensesPage
