import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Segmented, Space, Table, Tag, Typography, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import * as api from '@/api/teacherClass'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'

const { Paragraph, Text } = Typography

const CATEGORIES = ['all', 'members', 'work', 'assignments', 'teachers', 'messages', 'class']

const ROLE_TAGS = { owner: 'blue', co_teacher: 'cyan', admin: 'purple', student: 'default' }

// The server adds actions before an old tab reloads: those show as a plain "action".
const messageId = (event, intl) => {
  let id = `class_history.${event.action}`
  if (event.action === 'work_reviewed') id = `class_history.work_review_${event.detail}`
  if (event.action === 'work_submitted' && event.detail === 'late') id += '_late'
  if (event.action === 'message_sent' && !event.targetId) id += '_many'
  return intl.messages[id] ? id : 'class_history.unknown_action'
}

const userName = (intl, name, id) =>
  name || intl.formatMessage({ id: 'class_history.unknown_user' }, { id })

// member_removed keeps the login of a user the LMS could not find: nothing else names them.
const targetName = (event, intl) => {
  if (!event.targetId && event.action === 'member_removed') return event.detail
  return userName(intl, event.targetName, event.targetId)
}

const eventText = (event, intl) => {
  const isDate = ['co_teacher_added', 'co_teacher_extended'].includes(event.action)
  return intl.formatMessage(
    { id: messageId(event, intl) },
    {
      target: targetName(event, intl),
      title: event.title,
      detail: event.detail,
      count: Number(event.detail) || 0,
      date: isDate ? intl.formatDate(event.detail) : '',
    },
  )
}

const ClassHistory = ({ classId, active, reloadKey }) => {
  const intl = useIntl()
  const [category, setCategory] = useState('all')
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState('')
  const [loading, setLoading] = useState(false)
  // Only the latest request may answer: the filter can change while another page is on its way.
  const lastRequest = useRef(0)

  const load = useCallback(
    async after => {
      const request = ++lastRequest.current
      setLoading(true)
      try {
        const { data } = await api.listClassHistory(classId, {
          category: category === 'all' ? undefined : category,
          cursor: after,
        })
        if (request !== lastRequest.current) return
        setItems(prev => (after ? [...prev, ...(data.items || [])] : data.items || []))
        setCursor(data.nextCursor || '')
      } catch (e) {
        if (request === lastRequest.current) {
          message.error(apiErrorMessage(e, intl, 'errors.generic'))
        }
      } finally {
        if (request === lastRequest.current) setLoading(false)
      }
    },
    [classId, category, intl],
  )

  useEffect(() => {
    if (active) load()
  }, [active, load, reloadKey])

  const columns = [
    {
      title: <FormattedMessage id='class_history.when' />,
      dataIndex: 'createdAt',
      width: 170,
      render: value => <Text type='secondary'>{formatDateTime(value, intl.locale)}</Text>,
    },
    {
      title: <FormattedMessage id='class_history.who' />,
      key: 'actor',
      render: (_, event) => (
        <Space size={4} wrap>
          <Text>{userName(intl, event.actorName, event.actorId)}</Text>
          <Tag color={ROLE_TAGS[event.actorRole]}>
            <FormattedMessage id={`class_history.role_${event.actorRole}`} />
          </Tag>
        </Space>
      ),
    },
    {
      title: <FormattedMessage id='class_history.what' />,
      key: 'what',
      render: (_, event) => eventText(event, intl),
    },
  ]

  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <Paragraph type='secondary' style={{ marginBottom: 0 }}>
        <FormattedMessage id='class_history.hint' />
      </Paragraph>
      {/* Seven filters do not fit a phone. */}
      <div style={{ overflowX: 'auto' }}>
        <Segmented
          value={category}
          onChange={setCategory}
          options={CATEGORIES.map(key => ({
            value: key,
            label: intl.formatMessage({ id: `class_history.filter_${key}` }),
          }))}
        />
      </div>
      <Table
        rowKey='id'
        loading={loading}
        dataSource={items}
        columns={columns}
        pagination={false}
        scroll={{ x: true }}
        locale={{ emptyText: intl.formatMessage({ id: 'class_history.empty' }) }}
      />
      {cursor ? (
        <Button loading={loading} onClick={() => load(cursor)}>
          <FormattedMessage id='class_history.more' />
        </Button>
      ) : null}
    </Space>
  )
}

export default ClassHistory
