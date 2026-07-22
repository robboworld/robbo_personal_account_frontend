import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Empty, List, Typography, message, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'

import { listMyLicenses, revokeSeat } from '@/api/licensing'
import { LICENSES_CATALOG_ROUTE } from '@/constants'

const { Title, Text, Paragraph } = Typography

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
    <div style={{ maxWidth: 840, margin: '24px auto', padding: '0 16px' }}>
      <Title level={3}>{intl.formatMessage({ id: 'licensing.my_title' })}</Title>
      <Paragraph type='secondary'>{intl.formatMessage({ id: 'licensing.my_hint' })}</Paragraph>
      {!loading && licenses.length === 0 ? (
        <Empty description={intl.formatMessage({ id: 'licensing.my_empty' })}>
          <Link to={LICENSES_CATALOG_ROUTE}>
            <Button type='primary'>{intl.formatMessage({ id: 'payments.buy' })}</Button>
          </Link>
        </Empty>
      ) : (
        <List
          loading={loading}
          dataSource={licenses}
          renderItem={lic => (
            <Card key={lic.id} style={{ marginBottom: 16 }}>
              <Paragraph>
                <Text strong>{intl.formatMessage({ id: 'licensing.license_key' })}: </Text>
                <Text code copyable>{lic.licenseKey}</Text>
              </Paragraph>
              <Paragraph>
                <Text type='secondary'>
                  {lic.status} · seats {lic.seats?.length || 0}/{lic.seatLimit} · {intl.formatMessage({ id: 'licensing.expires_at' })}: {lic.expiresAt}
                </Text>
              </Paragraph>
              {(lic.seats || []).length === 0 ? (
                <Text type='secondary'>{intl.formatMessage({ id: 'licensing.no_seats' })}</Text>
              ) : (
                <List
                  size='small'
                  dataSource={lic.seats}
                  renderItem={seat => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          key='revoke'
                          title={intl.formatMessage({ id: 'licensing.revoke_confirm' })}
                          onConfirm={() => onRevoke(lic.id, seat.seatId)}
                        >
                          <Button danger size='small'>
                            {intl.formatMessage({ id: 'licensing.revoke_seat' })}
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      <Text code>{seat.seatId}</Text>
                      <Text type='secondary' style={{ marginLeft: 8 }}>
                        {seat.deviceFingerprint?.slice(0, 12)}…
                      </Text>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}
        />
      )}
    </div>
  )
}

export default MyLicensesPage
