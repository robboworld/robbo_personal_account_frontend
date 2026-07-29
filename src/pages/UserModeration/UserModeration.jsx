import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Empty,
  Input,
  List,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd'
import { useIntl, FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'

import { searchLmsUsers } from '@/api/users'
import { PROFILE_PAGE_ROUTE, STUDENT, TEACHER, SUPER_ADMIN, USER_ROLE_MESSAGE_IDS } from '@/constants'
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

const { Text } = Typography

const roleFromHit = hit => {
  if (typeof hit?.role === 'number') {
    return hit.role
  }
  return STUDENT
}

const UserModerationPage = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [includeInactive, setIncludeInactive] = useState(true)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)
  const reqRef = useRef(0)

  const runSearch = useCallback(async (text, inactive) => {
    const q = String(text || '').trim()
    if (!q) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const reqId = ++reqRef.current
    try {
      const results = await searchLmsUsers(q, 30, { includeInactive: inactive })
      if (reqId === reqRef.current) {
        setItems(results)
      }
    } catch (e) {
      if (reqId === reqRef.current) {
        setItems([])
        message.error(e?.response?.data?.error || e.message)
      }
    } finally {
      if (reqId === reqRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  // Re-query when returning to the tab so ban badges stay in sync with LMS/ES.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && query.trim()) {
        runSearch(query, includeInactive)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [query, includeInactive, runSearch])

  const onQueryChange = value => {
    setQuery(value)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      runSearch(value, includeInactive)
    }, 300)
  }

  const onToggleInactive = checked => {
    setIncludeInactive(checked)
    runSearch(query, checked)
  }

  const openProfile = hit => {
    navigate(PROFILE_PAGE_ROUTE, {
      state: {
        userId: hit.id,
        userRole: roleFromHit(hit),
      },
    })
  }

  return (
    <PageContent>
      <motion.div variants={staggerContainer} initial='hidden'
animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='users_moderation.title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='users_moderation.lead' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        <Stagger variants={staggerItem}>
          <GlassPanel>
            <Space direction='vertical' size='middle'
style={{ width: '100%' }}>
              <Input
                allowClear
                size='large'
                prefix={<SearchOutlined />}
                value={query}
                onChange={e => onQueryChange(e.target.value)}
                placeholder={intl.formatMessage({ id: 'users_moderation.search_placeholder' })}
              />
              <Checkbox
                checked={includeInactive}
                onChange={e => onToggleInactive(e.target.checked)}
              >
                <FormattedMessage id='users_moderation.show_banned' />
              </Checkbox>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <Spin />
                </div>
              ) : null}

              {!loading && query.trim() && items.length === 0 ? (
                <Empty description={intl.formatMessage({ id: 'users_moderation.empty' })} />
              ) : null}

              {!loading && items.length > 0 ? (
                <List
                  dataSource={items}
                  renderItem={hit => {
                    const roleId = USER_ROLE_MESSAGE_IDS[roleFromHit(hit)] || USER_ROLE_MESSAGE_IDS[STUDENT]
                    const active = hit.isActive !== false
                    return (
                      <List.Item
                        actions={[
                          <Button
                            key='open'
                            type='primary'
                            icon={<UserOutlined />}
                            onClick={() => openProfile(hit)}
                          >
                            <FormattedMessage id='users_moderation.open_profile' />
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={(
                            <Space wrap>
                              <Text strong>{hit.username}</Text>
                              {active ? (
                                <Tag color='success'>
                                  <FormattedMessage id='users_moderation.badge_active' />
                                </Tag>
                              ) : (
                                <Tag color='error'>
                                  <FormattedMessage id='users_moderation.badge_banned' />
                                </Tag>
                              )}
                              {roleFromHit(hit) === SUPER_ADMIN || roleFromHit(hit) === TEACHER ? (
                                <Tag>
                                  <FormattedMessage id={roleId} />
                                </Tag>
                              ) : (
                                <Tag>
                                  <FormattedMessage id={roleId} />
                                </Tag>
                              )}
                            </Space>
                          )}
                          description={(
                            <Space direction='vertical' size={0}>
                              {hit.email ? <Text type='secondary'>{hit.email}</Text> : null}
                              {hit.fullName ? <Text type='secondary'>{hit.fullName}</Text> : null}
                            </Space>
                          )}
                        />
                      </List.Item>
                    )
                  }}
                />
              ) : null}

              {!query.trim() ? (
                <Alert
                  type='info'
                  showIcon
                  message={intl.formatMessage({ id: 'users_moderation.hint' })}
                />
              ) : null}
            </Space>
          </GlassPanel>
        </Stagger>
      </motion.div>
    </PageContent>
  )
}

export default UserModerationPage
