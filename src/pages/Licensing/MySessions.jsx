import React, { useCallback, useEffect, useState } from 'react'
import { Button, Empty, Spin, Typography, message, Popconfirm } from 'antd'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

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
import { authAPI } from '@/api/auth'

const { Text } = Typography

const formatWhen = (iso, locale) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch (e) {
    return iso
  }
}

const MySessionsPage = () => {
  const intl = useIntl()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await authAPI.listSessions()
      setSessions(data?.sessions || [])
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onRevoke = async sessionId => {
    setRevokingId(sessionId)
    try {
      await authAPI.revokeSession(sessionId)
      message.success(intl.formatMessage({ id: 'sessions.revoked' }))
      await load()
    } catch (e) {
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              {intl.formatMessage({ id: 'sessions.title' })}
            </HeroTitle>
            <HeroLead>
              {intl.formatMessage({ id: 'sessions.hint' })}
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <Spin />
              </div>
            ) : sessions.length === 0 ? (
              <Empty description={intl.formatMessage({ id: 'sessions.empty' })} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sessions.map(session => (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Text strong>
                        {session.authMode || intl.formatMessage({ id: 'sessions.unknown_mode' })}
                      </Text>
                      <div>
                        <Text type='secondary'>
                          {session.userAgent || intl.formatMessage({ id: 'sessions.unknown_ua' })}
                        </Text>
                      </div>
                      <div>
                        <Text type='secondary'>
                          {intl.formatMessage({ id: 'sessions.last_seen' })}
                          {': '}
                          {formatWhen(session.lastSeenAt, intl.locale)}
                          {session.ipAddress ? ` · ${session.ipAddress}` : ''}
                        </Text>
                      </div>
                    </div>
                    <Popconfirm
                      title={intl.formatMessage({ id: 'sessions.revoke_confirm' })}
                      onConfirm={() => onRevoke(session.id)}
                    >
                      <Button
                        danger
                        size='small'
                        loading={revokingId === session.id}
                        disabled={!!revokingId}
                      >
                        {intl.formatMessage({ id: 'sessions.revoke' })}
                      </Button>
                    </Popconfirm>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </Stagger>
    </PageContent>
  )
}

export default MySessionsPage
