import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Checkbox,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { CopyOutlined, PrinterOutlined, QrcodeOutlined, UserAddOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import KidCardsSheet from './KidCardsSheet'

import * as api from '@/api/kidLogin'
import { KidAvatar, KidPicture } from '@/components/KidPictures'
import QrCode from '@/components/QrCode'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'

const { Paragraph, Text } = Typography

// "Вход учеников" on the class board (architecture/ADR_CLASS_KID_LOGIN.md): accounts the
// teacher makes for young children, the lesson window for picture sign-in, printed cards.

const WINDOW_OPTIONS = [45, 90, 120, 180, 240]

// What a laptop types: the site address without the scheme and the /k page, which the landing
// button "Вход в класс" opens.
const siteAddress = entryUrl =>
  String(entryUrl || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/k$/, '')

const codeStyle = size => ({
  fontSize: size,
  fontWeight: 700,
  letterSpacing: '0.15em',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.1,
})

const KidLoginPanel = ({ classId, className, active }) => {
  const intl = useIntl()
  const [roster, setRoster] = useState(null)
  const [loading, setLoading] = useState(false)
  const [minutes, setMinutes] = useState(90)
  const [addOpen, setAddOpen] = useState(false)
  const [names, setNames] = useState('')
  const [consent, setConsent] = useState(false)
  const [adding, setAdding] = useState(false)
  const [selected, setSelected] = useState([])
  const [cards, setCards] = useState(null)
  const [qrOpen, setQrOpen] = useState(false)
  const fail = e => message.error(apiErrorMessage(e, intl, 'errors.generic'))

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listKids(classId)
      setRoster(data)
    } catch (e) {
      fail(e)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  useEffect(() => {
    if (active) load()
  }, [active, load])

  const room = roster?.room
  const kids = roster?.kids || []
  const nameLines = names.split('\n').filter(l => l.trim())
  const maxBatch = roster?.maxBatch || 40

  const onOpen = async () => {
    try {
      const { data } = await api.openKidLogin(classId, minutes)
      setRoster(r => ({ ...r, room: data }))
    } catch (e) {
      fail(e)
    }
  }

  const onClose = async () => {
    try {
      const { data } = await api.closeKidLogin(classId)
      setRoster(r => ({ ...r, room: data }))
    } catch (e) {
      fail(e)
    }
  }

  const onAdd = async () => {
    setAdding(true)
    try {
      const { data } = await api.createKids(classId, { names: nameLines, consent })
      message.success(
        intl.formatMessage({ id: 'kid_login.added' }, { count: (data.kids || []).length }),
      )
      setAddOpen(false)
      setNames('')
      setConsent(false)
      load()
    } catch (e) {
      fail(e)
    } finally {
      setAdding(false)
    }
  }

  const onKidAction = async (call, okId) => {
    try {
      await call()
      message.success(intl.formatMessage({ id: okId }))
      load()
    } catch (e) {
      fail(e)
    }
  }

  const onPrint = async () => {
    const ids = selected.length ? selected : kids.filter(k => k.inClass).map(k => k.userId)
    if (!ids.length) return
    try {
      const { data } = await api.issueKidCards(classId, ids)
      setCards(data.cards || [])
      load()
    } catch (e) {
      fail(e)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(room.loginUrl)
      message.success(intl.formatMessage({ id: 'kid_login.link_copied' }))
    } catch {
      message.info(room.loginUrl)
    }
  }

  const columns = [
    {
      key: 'kid',
      title: intl.formatMessage({ id: 'kid_login.col_kid' }),
      // A name is short ("Маша К."): never broken letter by letter in a narrow table.
      onCell: () => ({ style: { whiteSpace: 'nowrap' } }),
      render: (_, k) => (
        <Space wrap={false}>
          <KidAvatar index={k.avatar} size={36} />
          <Text strong>{k.name}</Text>
        </Space>
      ),
    },
    {
      key: 'pictures',
      title: intl.formatMessage({ id: 'kid_login.col_pictures' }),
      render: (_, k) => (
        <Space size={4} wrap={false}>
          {k.pictures.map((p, i) => (
            <KidPicture key={i} index={p} size={26} />
          ))}
        </Space>
      ),
    },
    {
      key: 'state',
      title: intl.formatMessage({ id: 'kid_login.col_state' }),
      render: (_, k) => (
        <Space size={4} wrap>
          {k.locked ? (
            <Tag color='red'>
              <FormattedMessage id='kid_login.locked' />
            </Tag>
          ) : null}
          {!k.inClass ? (
            <Tag>
              <FormattedMessage id='kid_login.not_in_class' />
            </Tag>
          ) : null}
          {k.hasCard ? (
            <Tag color='blue'>
              <FormattedMessage id='kid_login.has_card' />
            </Tag>
          ) : null}
        </Space>
      ),
    },
    {
      key: 'last',
      title: intl.formatMessage({ id: 'kid_login.col_last_login' }),
      render: (_, k) => (k.lastLoginAt ? formatDateTime(k.lastLoginAt) : '—'),
    },
    {
      key: 'actions',
      render: (_, k) => (
        <Space wrap>
          {k.locked ? (
            <Button
              size='small'
              onClick={() =>
                onKidAction(() => api.unlockKid(classId, k.userId), 'kid_login.unlocked')
              }>
              <FormattedMessage id='kid_login.unlock' />
            </Button>
          ) : null}
          {!k.inClass ? (
            <Button
              size='small'
              onClick={() =>
                onKidAction(() => api.returnKid(classId, k.userId), 'kid_login.returned')
              }>
              <FormattedMessage id='kid_login.return' />
            </Button>
          ) : null}
          <Popconfirm
            title={intl.formatMessage({ id: 'kid_login.new_pictures_confirm' })}
            onConfirm={() =>
              onKidAction(() => api.resetKidPictures(classId, k.userId), 'kid_login.pictures_set')
            }>
            <Button size='small'>
              <FormattedMessage id='kid_login.new_pictures' />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <Paragraph type='secondary' style={{ marginBottom: 0 }}>
        <FormattedMessage id='kid_login.hint' />
      </Paragraph>

      {room ? (
        <Alert
          type={room.openUntil ? 'success' : 'info'}
          showIcon
          title={
            room.openUntil
              ? intl.formatMessage(
                  { id: 'kid_login.open_until' },
                  { time: intl.formatTime(room.openUntil) },
                )
              : intl.formatMessage({ id: 'kid_login.closed' })
          }
          description={
            room.roomCode ? (
              <Space orientation='vertical' size={0}>
                <Text>
                  <FormattedMessage
                    id='kid_login.code_hint'
                    values={{ address: <Text code>{siteAddress(room.entryUrl)}</Text> }}
                  />
                </Text>
                <span style={codeStyle(40)} data-testid='kid-room-code'>
                  {room.roomCode}
                </span>
              </Space>
            ) : null
          }
          action={
            <Space wrap>
              {room.openUntil ? (
                <Button onClick={onClose}>
                  <FormattedMessage id='kid_login.close' />
                </Button>
              ) : (
                <React.Fragment>
                  <Select
                    value={minutes}
                    onChange={setMinutes}
                    style={{ width: 120 }}
                    options={WINDOW_OPTIONS.map(m => ({
                      value: m,
                      label: intl.formatMessage({ id: 'kid_login.minutes' }, { m }),
                    }))}
                  />
                  <Button type='primary' onClick={onOpen} disabled={!kids.length}>
                    <FormattedMessage id='kid_login.open' />
                  </Button>
                </React.Fragment>
              )}
              <Button icon={<QrcodeOutlined />} onClick={() => setQrOpen(true)}>
                <FormattedMessage id='kid_login.projector' />
              </Button>
              <Button icon={<CopyOutlined />} onClick={copyLink}>
                <FormattedMessage id='kid_login.copy_link' />
              </Button>
            </Space>
          }
        />
      ) : null}

      <Space wrap>
        <Button type='primary' icon={<UserAddOutlined />} onClick={() => setAddOpen(true)}>
          <FormattedMessage id='kid_login.add' />
        </Button>
        <Popconfirm
          title={intl.formatMessage({ id: 'kid_login.print_confirm' })}
          onConfirm={onPrint}
          disabled={!kids.length}>
          <Button icon={<PrinterOutlined />} disabled={!kids.length}>
            {selected.length ? (
              <FormattedMessage id='kid_login.print_selected' values={{ count: selected.length }} />
            ) : (
              <FormattedMessage id='kid_login.print_all' />
            )}
          </Button>
        </Popconfirm>
        {roster ? (
          <Text type='secondary'>
            <FormattedMessage
              id='kid_login.count'
              values={{ count: kids.length, max: roster.maxKids }}
            />
          </Text>
        ) : null}
      </Space>

      <Table
        rowKey='userId'
        loading={loading}
        dataSource={kids}
        columns={columns}
        pagination={false}
        scroll={{ x: true }}
        rowSelection={{ selectedRowKeys: selected, onChange: keys => setSelected(keys) }}
        locale={{ emptyText: intl.formatMessage({ id: 'kid_login.empty' }) }}
      />

      <Modal
        open={addOpen}
        title={<FormattedMessage id='kid_login.add' />}
        onCancel={() => setAddOpen(false)}
        onOk={onAdd}
        okText={intl.formatMessage({ id: 'kid_login.add_ok' }, { count: nameLines.length })}
        okButtonProps={{
          loading: adding,
          disabled: !consent || !nameLines.length || nameLines.length > maxBatch,
        }}>
        <Paragraph>
          <FormattedMessage id='kid_login.add_hint' values={{ max: maxBatch }} />
        </Paragraph>
        <Input.TextArea
          rows={8}
          value={names}
          onChange={e => setNames(e.target.value)}
          placeholder={intl.formatMessage({ id: 'kid_login.add_placeholder' })}
          aria-label={intl.formatMessage({ id: 'kid_login.add' })}
        />
        {nameLines.length > maxBatch ? (
          <Text type='danger'>
            <FormattedMessage id='kid_login.add_too_many' values={{ max: maxBatch }} />
          </Text>
        ) : null}
        <Checkbox
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          style={{ marginTop: 12 }}>
          <FormattedMessage id='kid_login.consent' />
        </Checkbox>
      </Modal>

      <Modal
        open={qrOpen}
        title={className}
        footer={null}
        onCancel={() => setQrOpen(false)}
        width={720}>
        {room && room.roomCode ? (
          <div style={{ textAlign: 'center' }}>
            <Paragraph style={{ fontSize: 22, marginBottom: 4 }}>
              <FormattedMessage id='kid_login.projector_open' />
            </Paragraph>
            <div style={{ fontSize: 34, fontWeight: 600 }}>{siteAddress(room.entryUrl)}</div>
            <Paragraph style={{ fontSize: 22, margin: '12px 0 0' }}>
              <FormattedMessage id='kid_login.projector_type' />
            </Paragraph>
            <div style={codeStyle(96)}>{room.roomCode}</div>
            <Paragraph type='secondary' style={{ marginTop: 12 }}>
              <FormattedMessage id='kid_login.projector_tablet' />
            </Paragraph>
            <QrCode text={`${room.entryUrl}/${room.roomCode}`} size={220} title={className} />
          </div>
        ) : null}
        {room && !room.roomCode ? (
          <div style={{ textAlign: 'center' }}>
            <Alert
              type='info'
              showIcon
              title={intl.formatMessage({ id: 'kid_login.projector_closed' })}
            />
            <QrCode text={room.loginUrl} size={320} title={className} />
            <Paragraph copyable style={{ marginTop: 12 }}>
              {room.loginUrl}
            </Paragraph>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={!!cards}
        title={<FormattedMessage id='kid_login.cards_title' />}
        onCancel={() => setCards(null)}
        width={900}
        footer={[
          <Button key='close' onClick={() => setCards(null)}>
            <FormattedMessage id='kid_login.cards_close' />
          </Button>,
          <Button
            key='print'
            type='primary'
            icon={<PrinterOutlined />}
            onClick={() => window.print()}>
            <FormattedMessage id='kid_login.print' />
          </Button>,
        ]}>
        <Paragraph type='warning'>
          <FormattedMessage id='kid_login.cards_once' />
        </Paragraph>
        {cards ? <KidCardsSheet className={className} cards={cards} /> : null}
      </Modal>
    </Space>
  )
}

KidLoginPanel.propTypes = {
  classId: PropTypes.string.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool,
}

export default KidLoginPanel
