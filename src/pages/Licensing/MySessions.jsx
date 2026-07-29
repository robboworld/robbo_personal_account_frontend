import React, { useCallback, useEffect, useState } from 'react'
import { Button, Empty, Spin, Tag, Typography, message, Popconfirm } from 'antd'
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
import { redirectToOidcLogout, isOidcSsoEnabled } from '@/helpers/oidcSession'
import { LANDING_PAGE_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants'

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

const forceSessionExpiredLogout = () => {
  localStorage.removeItem('token')
  if (isOidcSsoEnabled()) {
    redirectToOidcLogout(`${LANDING_PAGE_ROUTE}?session_expired=1`)
    return
  }
  window.location.assign(`${LOGIN_PAGE_ROUTE}?session_expired=1`)
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
      if (e?.response?.data?.code === 'SESSION_NOT_FOUND' || e?.response?.status === 401) {
        forceSessionExpiredLogout()
        return
      }
      message.error(e?.response?.data?.error || e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onRevoke = async sessionId => {
    const target = sessions.find(s => s.id === sessionId)
    setRevokingId(sessionId)
    try {
      const { data } = await authAPI.revokeSession(sessionId)
      if (data?.wasCurrent || target?.isCurrent) {
        forceSessionExpiredLogout()
        return
      }
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
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text strong>
                          {session.authMode || intl.formatMessage({ id: 'sessions.unknown_mode' })}
                        </Text>
                        {session.isCurrent ? (
                          <Tag color='green'>{intl.formatMessage({ id: 'sessions.current' })}</Tag>
                        ) : null}
                      </div>
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
                      title={
                        session.isCurrent
                          ? intl.formatMessage({ id: 'sessions.revoke_current_confirm' })
                          : intl.formatMessage({ id: 'sessions.revoke_confirm' })
                      }
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
