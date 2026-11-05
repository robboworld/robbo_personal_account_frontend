import React, { useCallback, useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, List, Modal, Popconfirm, Typography, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'dayjs'

import * as api from '@/api/teacherClass'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

const { Paragraph, Text } = Typography

// classes.coTeacherMaxDays by default; the server has the last word (bad_co_teacher_term).
const MAX_TERM_DAYS = 90

// The last day of a term is whole, whatever time the date was picked at.
const termEnd = date => date.endOf('day').toISOString()

const outOfTerm = date =>
  date.isBefore(dayjs(), 'day') || date.isAfter(dayjs().add(MAX_TERM_DAYS - 1, 'day'), 'day')

const CoTeachersModal = ({ open, classId, isCoTeacher, onClose, onLeft }) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [items, setItems] = useState([])
  const [adding, setAdding] = useState(false)
  const fail = e => message.error(apiErrorMessage(e, intl, 'errors.generic'))

  const load = useCallback(async () => {
    try {
      const { data } = await api.listCoTeachers(classId)
      setItems(data.items || [])
    } catch (e) {
      fail(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  const onAdd = async values => {
    setAdding(true)
    try {
      await api.addCoTeacher(classId, {
        email: values.email.trim(),
        expiresAt: termEnd(values.until),
      })
      message.success(intl.formatMessage({ id: 'co_teachers.added' }))
      form.resetFields()
      load()
    } catch (e) {
      fail(e)
    } finally {
      setAdding(false)
    }
  }

  const onExtend = async (teacherId, date) => {
    if (!date) return
    try {
      await api.extendCoTeacher(classId, teacherId, termEnd(date))
      message.success(intl.formatMessage({ id: 'co_teachers.extended' }))
      load()
    } catch (e) {
      fail(e)
    }
  }

  const onRemove = async teacherId => {
    try {
      await api.removeCoTeacher(classId, teacherId)
      message.success(intl.formatMessage({ id: 'co_teachers.removed' }))
      load()
    } catch (e) {
      fail(e)
    }
  }

  const onLeave = async () => {
    try {
      await api.removeCoTeacher(classId, 'me')
      message.success(intl.formatMessage({ id: 'co_teachers.left' }))
      onLeft()
    } catch (e) {
      fail(e)
    }
  }

  const required = { required: true, message: intl.formatMessage({ id: 'form.required' }) }

  return (
    <Modal
      open={open}
      title={<FormattedMessage id='co_teachers.title' />}
      onCancel={onClose}
      footer={null}>
      {isCoTeacher ? null : (
        <Paragraph type='secondary'>
          <FormattedMessage id='co_teachers.hint' />
        </Paragraph>
      )}
      <List
        size='small'
        dataSource={items}
        locale={{ emptyText: intl.formatMessage({ id: 'co_teachers.empty' }) }}
        renderItem={item => (
          <List.Item
            actions={
              isCoTeacher
                ? []
                : [
                    <DatePicker
                      key='until'
                      allowClear={false}
                      value={dayjs(item.expiresAt)}
                      format='DD.MM.YYYY'
                      disabledDate={outOfTerm}
                      aria-label={intl.formatMessage({ id: 'co_teachers.until' })}
                      onChange={date => onExtend(item.teacherId, date)}
                    />,
                    <Popconfirm
                      key='remove'
                      title={intl.formatMessage({ id: 'co_teachers.remove_confirm' })}
                      okText={intl.formatMessage({ id: 'co_teachers.remove' })}
                      okButtonProps={{ danger: true }}
                      cancelText={intl.formatMessage({ id: 'common.cancel' })}
                      onConfirm={() => onRemove(item.teacherId)}>
                      <Button type='link' danger size='small'>
                        <FormattedMessage id='co_teachers.remove' />
                      </Button>
                    </Popconfirm>,
                  ]
            }>
            <List.Item.Meta
              title={item.name || item.teacherId}
              description={
                isCoTeacher ? (
                  <Text type='secondary'>
                    <FormattedMessage id='co_teachers.until' />: {intl.formatDate(item.expiresAt)}
                  </Text>
                ) : null
              }
            />
          </List.Item>
        )}
      />
      {isCoTeacher ? (
        <Popconfirm
          title={intl.formatMessage({ id: 'co_teachers.leave_confirm' })}
          okText={intl.formatMessage({ id: 'co_teachers.leave' })}
          okButtonProps={{ danger: true }}
          cancelText={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={onLeave}>
          <Button danger style={{ marginTop: 16 }}>
            <FormattedMessage id='co_teachers.leave' />
          </Button>
        </Popconfirm>
      ) : (
        <Form form={form} layout='vertical' onFinish={onAdd} style={{ marginTop: 16 }}>
          <Form.Item
            name='email'
            label={<FormattedMessage id='co_teachers.email' />}
            rules={[
              required,
              { type: 'email', message: intl.formatMessage({ id: 'sign_up_form.email_invalid' }) },
            ]}>
            <Input type='email' autoComplete='off' />
          </Form.Item>
          <Form.Item
            name='until'
            label={<FormattedMessage id='co_teachers.until' />}
            rules={[required]}>
            <DatePicker format='DD.MM.YYYY' disabledDate={outOfTerm} style={{ width: '100%' }} />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={adding}>
            <FormattedMessage id='co_teachers.add' />
          </Button>
        </Form>
      )}
    </Modal>
  )
}

export default CoTeachersModal
