import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Empty, Progress, Spin, Typography, message } from 'antd'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import FeatureInterestPanel from './FeatureInterestPanel'
import {
  KeyBlock,
  KeyBlockLabel,
  LicenseKeyRow,
  LicenseLabel,
  LicenseStack,
  PanelSectionTitle,
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
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { listMyLicenses, getEntitlements } from '@/api/licensing'
import { authAPI } from '@/api/auth'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatStorageMb, tariffDisplayName } from '@/helpers/tariffs'
import theme from '@/theme'

const METER_COLOR = theme.colors.accentGreen

const { Text } = Typography

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
  // The size limit is per project; the number of projects is not limited.
  const sizeMb = Number(entitlements.maxProjectSizeMb ?? entitlements.cloudQuotaMb) || 0
  const projectCount = Number(entitlements.projectCount) || 0

  const storageMb = Number(entitlements.storageQuotaMb) || 0
  const usedMb = (Number(entitlements.usedBytes) || 0) / (1024 * 1024)
  const storagePercent = meterPercent(usedMb, storageMb)
  const storageFull = storageMb > 0 && usedMb >= storageMb

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
            { tariff: tariffDisplayName(intl, entitlements.tariffName) },
          )}
        </TariffBadge>
      </UsageHeader>
      <UsageStack>
        {storageMb > 0 ? (
          <UsageMeter>
            <UsageMeterTop>
              <UsageMeterLabel>{intl.formatMessage({ id: 'licensing.storage' })}</UsageMeterLabel>
              <UsageMeterValue>
                {intl.formatMessage(
                  { id: 'licensing.usage_count_value' },
                  { used: formatStorageMb(intl, usedMb), limit: formatStorageMb(intl, storageMb) },
                )}
              </UsageMeterValue>
            </UsageMeterTop>
            <Progress
              percent={storagePercent}
              status={meterStatus(storagePercent)}
              strokeColor={storagePercent >= 95 ? undefined : METER_COLOR}
            />
            {storageFull ? (
              <Text type='secondary' style={{ fontSize: 13 }}>
                {intl.formatMessage({ id: 'licensing.storage_full' })}
              </Text>
            ) : null}
          </UsageMeter>
        ) : null}

        <UsageMeter>
          <UsageMeterTop>
            <UsageMeterLabel>{intl.formatMessage({ id: 'licensing.projects' })}</UsageMeterLabel>
            <UsageMeterValue>
              {intl.formatMessage(
                { id: 'licensing.projects_unlimited_value' },
                { count: projectCount },
              )}
            </UsageMeterValue>
          </UsageMeterTop>
          {sizeMb > 0 ? (
            <Text type='secondary' style={{ fontSize: 13 }}>
              {intl.formatMessage({ id: 'tariff.project_size' }, { mb: sizeMb })}
            </Text>
          ) : null}
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
            strokeColor={!sessionsUnlimited && sessionsPercent >= 95 ? undefined : METER_COLOR}
          />
        </UsageMeter>

        {/* Seats are RS3 Desktop activations by license key: nothing to count without one. */}
        {entitlements.hasLicense ? (
          <UsageMeter>
            <UsageMeterTop>
              <UsageMeterLabel>{intl.formatMessage({ id: 'licensing.devices' })}</UsageMeterLabel>
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
              strokeColor={seatLimit > 0 && seatsPercent >= 95 ? undefined : METER_COLOR}
            />
          </UsageMeter>
        ) : null}
      </UsageStack>
    </GlassPanel>
  )
}

const MyLicensesPage = () => {
  const intl = useIntl()
  const [licenses, setLicenses] = useState([])
  const [entitlements, setEntitlements] = useState(null)
  const [activeSessions, setActiveSessions] = useState(0)
  const [licensesLoading, setLicensesLoading] = useState(true)

  const loadLicenses = useCallback(async () => {
    setLicensesLoading(true)
    try {
      const list = await listMyLicenses()
      setLicenses(list)
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setLicensesLoading(false)
    }
  }, [intl])

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
    loadUsage()
  }, [loadLicenses, loadUsage])

  const activeLicenses = useMemo(() => (licenses || []).filter(isLicenseActive), [licenses])

  const primaryLicense = activeLicenses[0] || licenses[0] || null

  const seatsUsed = useMemo(
    () => (licenses || []).reduce((sum, lic) => sum + ((lic.seats && lic.seats.length) || 0), 0),
    [licenses],
  )

  const tariffName = entitlements?.tariffName || 'Free'
  const hasActive = activeLicenses.length > 0
  const seatLimit = Number(entitlements?.seatLimit ?? primaryLicense?.seatLimit) || 0
  const expiresLabel = formatExpiresAt(primaryLicense?.expiresAt, intl.locale)

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden' animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>{intl.formatMessage({ id: 'licensing.my_title' })}</HeroTitle>
            <HeroLead>{intl.formatMessage({ id: 'licensing.my_hint' })}</HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <SplitGrid>
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
                        { tariff: tariffDisplayName(intl, tariffName) },
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
                            <Text code copyable>
                              {lic.licenseKey}
                            </Text>
                          </LicenseKeyRow>
                        ))}
                      </LicenseStack>
                    </KeyBlock>
                  )}
                </React.Fragment>
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
          <FeatureInterestPanel />
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default MyLicensesPage
