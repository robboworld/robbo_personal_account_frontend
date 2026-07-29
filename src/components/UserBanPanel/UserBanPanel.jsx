import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'dayjs'

import {
  banUser,
  getUserBanHistory,
  getUserBanStatus,
  unbanUser,
} from '@/api/users'
import { SUPER_ADMIN, TEACHER } from '@/constants'
import { useAuthRole } from '@/helpers'
import { parseJwt } from '@/helpers/jwtParser'
import { useOidcSession } from '@/helpers/OidcSessionContext'
import { isOidcSsoEnabled } from '@/helpers/oidcSession'

import './UserBanPanel.css'

const { Text, Paragraph } = Typography
const { TextArea } = Input

const formatWhen = (iso, locale) => {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

const useSelfUserId = () => {
  const oidcSession = useOidcSession()
  if (isOidcSsoEnabled() && oidcSession?.authenticated) {
    return oidcSession?.edx_user_id || oidcSession?.sub || ''
  }
  const token = localStorage.getItem('token')
  if (!token) return ''
  try {
    return parseJwt(token).Id || ''
  } catch {
    return ''
  }
}

/**
 * SuperAdmin-only ban / unban panel for peek profiles.
 */
const UserBanPanel = ({ lmsUserId, peekUserRole }) => {
  const intl = useIntl()
  const role = useAuthRole()
  const selfId = useSelfUserId()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isBanned, setIsBanned] = useState(false)
  const [activeBan, setActiveBan] = useState(null)
  const [history, setHistory] = useState([])
  const [banForm] = Form.useForm()
  const [unbanForm] = Form.useForm()

  const canModerate = role === SUPER_ADMIN &&
    lmsUserId &&
    String(lmsUserId) !== String(selfId)

  const reload = useCallback(async () => {
    if (!canModerate) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [status, hist] = await Promise.all([
        getUserBanStatus(lmsUserId),
        getUserBanHistory(lmsUserId, 20),
      ])
      setIsBanned(Boolean(status?.isBanned))
      setActiveBan(status?.activeBan || null)
      setHistory(hist || [])
    } catch (e) {
      message.error(e?.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }, [canModerate, lmsUserId])

  useEffect(() => {
    reload()
  }, [reload])

  if (!canModerate) {
    return null
  }

  const isStaffTarget = peekUserRole === SUPER_ADMIN || peekUserRole === TEACHER

  const submitBan = async values => {
    const reason = String(values.reason || '').trim()
    if (!reason) {
      message.error(intl.formatMessage({ id: 'moderation.reason_required' }))
      return
    }
    let expiresAt = null
    if (values.banType === 'temporary') {
      if (!values.expiresAt) {
        message.error(intl.formatMessage({ id: 'moderation.expires_required' }))
        return
      }
      expiresAt = values.expiresAt.toDate().toISOString()
    }

    const doBan = async () => {
      setSaving(true)
      try {
        await banUser(lmsUserId, { reason, expiresAt })
        message.success(intl.formatMessage({ id: 'moderation.ban_ok' }))
        banForm.resetFields()
        await reload()
      } catch (e) {
        message.error(e?.response?.data?.error || e.message)
      } finally {
        setSaving(false)
      }
    }

    if (isStaffTarget) {
      Modal.confirm({
        title: intl.formatMessage({ id: 'moderation.confirm_staff_title' }),
        content: intl.formatMessage({ id: 'moderation.confirm_staff_body' }),
        okType: 'danger',
        onOk: doBan,
      })
      return
    }

    Modal.confirm({
      title: intl.formatMessage({ id: 'moderation.confirm_ban_title' }),
      content: intl.formatMessage({ id: 'moderation.confirm_ban_body' }),
      okType: 'danger',
      onOk: doBan,
    })
  }

  const submitUnban = async values => {
    setSaving(true)
    try {
      await unbanUser(lmsUserId, { reason: String(values.reason || '').trim() })
      message.success(intl.formatMessage({ id: 'moderation.unban_ok' }))
      unbanForm.resetFields()
      await reload()
    } catch (e) {
      message.error(e?.response?.data?.error || e.message)
    } finally {
      setSaving(false)
    }
  }

  const historyColumns = [
    {
      title: intl.formatMessage({ id: 'moderation.col_banned_at' }),
      dataIndex: 'bannedAt',
      key: 'bannedAt',
      render: v => formatWhen(v, intl.locale),
    },
    {
      title: intl.formatMessage({ id: 'moderation.col_reason' }),
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'moderation.col_expires' }),
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (v, row) => (row.isPermanent || !v
        ? intl.formatMessage({ id: 'moderation.permanent' })
        : formatWhen(v, intl.locale)),
    },
    {
      title: intl.formatMessage({ id: 'moderation.col_status' }),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active, row) => {
        if (active) {
          return <Tag color='error'><FormattedMessage id='moderation.status_active' /></Tag>
        }
        const expiredByTime = row.expiresAt && new Date(row.expiresAt).getTime() <= Date.now()
        if (row.unbanReason === 'expired' || expiredByTime) {
          return <Tag><FormattedMessage id='moderation.status_expired' /></Tag>
        }
        return <Tag color='success'><FormattedMessage id='moderation.status_lifted' /></Tag>
      },
    },
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 16 }}>
        <Spin />
      </div>
    )
  }

  return (
    <div style={{ marginTop: 24 }}>
      <Typography.Title level={4} style={{ marginBottom: 12 }}>
        <FormattedMessage id='moderation.panel_title' />
      </Typography.Title>

      {isBanned && activeBan ? (
        <Space direction='vertical' size='middle'
style={{ width: '100%' }}>
          <Alert
            type='error'
            showIcon
            message={<FormattedMessage id='moderation.banned_alert' />}
            description={(
              <Space direction='vertical' size={4}>
                <Paragraph style={{ marginBottom: 0 }}>
                  <Text strong><FormattedMessage id='moderation.col_reason' />:</Text>
                  {' '}
                  {activeBan.reason}
                </Paragraph>
                <Text type='secondary'>
                  <FormattedMessage id='moderation.banned_at' />
                  {': '}
                  {formatWhen(activeBan.bannedAt, intl.locale)}
                </Text>
                <Text type='secondary'>
                  <FormattedMessage id='moderation.col_expires' />
                  {': '}
                  {activeBan.isPermanent || !activeBan.expiresAt
                    ? intl.formatMessage({ id: 'moderation.permanent' })
                    : formatWhen(activeBan.expiresAt, intl.locale)}
                </Text>
                <Text type='secondary'>
                  <FormattedMessage id='moderation.banned_by' />
                  {': '}
                  {activeBan.bannedByLmsUserId}
                </Text>
              </Space>
            )}
          />
          <Form form={unbanForm} layout='vertical'
onFinish={submitUnban}>
            <Form.Item name='reason' label={<FormattedMessage id='moderation.unban_reason' />}>
              <TextArea rows={2} maxLength={500}
showCount />
            </Form.Item>
            <Button type='primary' htmlType='submit'
loading={saving}>
              <FormattedMessage id='moderation.unban_button' />
            </Button>
          </Form>
        </Space>
      ) : (
        <Form
          form={banForm}
          layout='vertical'
          initialValues={{ banType: 'permanent' }}
          onFinish={submitBan}
        >
          <Form.Item
            name='reason'
            label={<FormattedMessage id='moderation.ban_reason' />}
            rules={[{ required: true, message: intl.formatMessage({ id: 'moderation.reason_required' }) }]}
          >
            <TextArea rows={3} maxLength={1000}
showCount />
          </Form.Item>
          <Form.Item name='banType' label={<FormattedMessage id='moderation.ban_type' />}>
            <Radio.Group>
              <Radio value='permanent'>
                <FormattedMessage id='moderation.type_permanent' />
              </Radio>
              <Radio value='temporary'>
                <FormattedMessage id='moderation.type_temporary' />
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.banType !== cur.banType}>
            {({ getFieldValue }) => (getFieldValue('banType') === 'temporary' ? (
              <Form.Item
                name='expiresAt'
                label={<FormattedMessage id='moderation.expires_at' />}
                rules={[{ required: true, message: intl.formatMessage({ id: 'moderation.expires_required' }) }]}
              >
                <DatePicker
                  showTime={{ format: 'HH:mm', showSecond: false }}
                  format='DD.MM.YYYY HH:mm'
                  placeholder={intl.formatMessage({ id: 'moderation.expires_placeholder' })}
                  style={{ width: '100%' }}
                  popupClassName='moderation-expires-picker'
                  popupStyle={{
                    '--moderation-hours-label': `"${intl.formatMessage({ id: 'moderation.time_hours' })}"`,
                    '--moderation-minutes-label': `"${intl.formatMessage({ id: 'moderation.time_minutes' })}"`,
                  }}
                  disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
                />
              </Form.Item>
            ) : null)}
          </Form.Item>
          <Button type='primary' danger
htmlType='submit' loading={saving}>
            <FormattedMessage id='moderation.ban_button' />
          </Button>
        </Form>
      )}

      {history.length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <Typography.Title level={5}>
            <FormattedMessage id='moderation.history_title' />
          </Typography.Title>
          <Table
            size='small'
            rowKey='id'
            pagination={false}
            columns={historyColumns}
            dataSource={history}
          />
        </div>
      ) : null}
    </div>
  )
}

UserBanPanel.propTypes = {
  lmsUserId: PropTypes.string,
  peekUserRole: PropTypes.number,
}

export default UserBanPanel
