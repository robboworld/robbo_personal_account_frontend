import React, { useCallback, useEffect, useState } from 'react'
import { Button, Empty, Spin, Typography, message, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import {
  LicenseCard,
  LicenseKeyRow,
  LicenseLabel,
  LicenseMeta,
  LicenseStack,
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
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { listMyLicenses, revokeSeat } from '@/api/licensing'
import { LICENSES_CATALOG_ROUTE } from '@/constants'

const { Text } = Typography

const MyLicensesPage = () => {
  const intl = useIntl()
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await listMyLicenses()
      setLicenses(list)
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onRevoke = async (licenseId, seatId) => {
    try {
      await revokeSeat(licenseId, seatId)
      message.success(intl.formatMessage({ id: 'licensing.seat_revoked' }))
      load()
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
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
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Spin />
              </div>
            ) : licenses.length === 0 ? (
              <Empty description={intl.formatMessage({ id: 'licensing.my_empty' })}>
                <Link to={LICENSES_CATALOG_ROUTE}>
                  <Button type='primary'>{intl.formatMessage({ id: 'payments.buy' })}</Button>
                </Link>
              </Empty>
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
      </Stagger>
    </PageContent>
  )
}

export default MyLicensesPage
