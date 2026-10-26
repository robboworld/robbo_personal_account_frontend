import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Typography,
  message,
  Tag,
} from 'antd'
import { PlusOutlined, TeamOutlined, CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import InviteDetails, { copyText } from './InviteDetails'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { SUPER_ADMIN, TEACHER_CLASS_BOARD_ROUTE } from '@/constants'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

const { Title, Paragraph, Text } = Typography

const boardPath = id => TEACHER_CLASS_BOARD_ROUTE.replace(':classId', id)

const TeacherClassesPage = ({ userRole }) => {
  // SuperAdmin gets every teacher's classes, so cards name the owner.
  const allClasses = userRole === SUPER_ADMIN
  const intl = useIntl()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(null)
  const [courses, setCourses] = useState(null)
  const [form] = Form.useForm()
  const required = { required: true, message: intl.formatMessage({ id: 'form.required' }) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listTeacherClasses()
      setItems(data.items || [])
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'teacher_class.load_error'))
    } finally {
      setLoading(false)
    }
  }, [intl])

  useEffect(() => {
    load()
  }, [load])

  // Courses for the picker load with the dialog; without them the field takes a typed id.
  useEffect(() => {
    if (!createOpen || courses !== null) return
    api
      .listTeacherCourses()
      .then(({ data }) => setCourses(data.items || []))
      .catch(() => setCourses([]))
  }, [createOpen, courses])

  const courseOptions = useMemo(
    () =>
      (courses || []).map(c => ({
        value: c.id,
        label: c.name ? `${c.name} · ${c.id}` : c.id,
      })),
    [courses],
  )

  const onCreate = async values => {
    setCreating(true)
    try {
      const { data } = await api.createTeacherClass({
        courseId: values.courseId.trim(),
        displayName: values.displayName.trim(),
      })
      message.success(intl.formatMessage({ id: 'teacher_class.created' }))
      setCreateOpen(false)
      form.resetFields()
      setInviteOpen(data)
      load()
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'teacher_class.create_failed'))
    } finally {
      setCreating(false)
    }
  }

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id={allClasses ? 'teacher_class.title_all' : 'teacher_class.title'} />
          </SectionTitle>
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            <FormattedMessage id='teacher_class.create' />
          </Button>
        </SectionHeader>
        <Paragraph type='secondary'>
          <FormattedMessage id='teacher_class.hint' />
        </Paragraph>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description={<FormattedMessage id='teacher_class.empty' />}>
            <Button type='primary' onClick={() => setCreateOpen(true)}>
              <FormattedMessage id='teacher_class.create' />
            </Button>
          </Empty>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}>
            {items.map(item => (
              <Card
                key={item.id}
                hoverable
                onClick={() => navigate(boardPath(item.id))}
                actions={[
                  <Button
                    key='invite'
                    type='link'
                    icon={<CopyOutlined />}
                    onClick={e => {
                      e.stopPropagation()
                      setInviteOpen(item)
                    }}>
                    <FormattedMessage id='teacher_class.invite' />
                  </Button>,
                  <Button
                    key='open'
                    type='link'
                    icon={<TeamOutlined />}
                    onClick={e => {
                      e.stopPropagation()
                      navigate(boardPath(item.id))
                    }}>
                    <FormattedMessage id='teacher_class.open_board' />
                  </Button>,
                ]}>
                <Title level={4} style={{ marginTop: 0 }}>
                  {item.displayName}
                </Title>
                <Text type='secondary' style={{ fontSize: 12 }}>
                  {item.edxCourseId}
                </Text>
                {allClasses && item.ownerName && (
                  <div>
                    <Text type='secondary'>
                      <FormattedMessage
                        id='teacher_class.owner'
                        values={{ name: item.ownerName }}
                      />
                    </Text>
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  <Tag
                    color='blue'
                    onClick={e => {
                      e.stopPropagation()
                      copyText(item.inviteCode, intl)
                    }}
                    style={{ cursor: 'copy' }}>
                    {item.inviteCode}
                  </Tag>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Panel>

      <Modal
        open={createOpen}
        title={<FormattedMessage id='teacher_class.create' />}
        onCancel={() => setCreateOpen(false)}
        onOk={() => form.submit()}
        okText={<FormattedMessage id='teacher_class.create' />}
        cancelText={<FormattedMessage id='common.cancel' />}
        confirmLoading={creating}>
        <Form form={form} layout='vertical' onFinish={onCreate}>
          <Form.Item
            name='displayName'
            label={<FormattedMessage id='teacher_class.name' />}
            rules={[required]}>
            <Input placeholder={intl.formatMessage({ id: 'teacher_class.name_placeholder' })} />
          </Form.Item>
          <Form.Item
            name='courseId'
            label={<FormattedMessage id='teacher_class.course' />}
            rules={[required]}
            extra={
              courses && courses.length === 0 ? (
                <FormattedMessage id='teacher_class.course_manual_hint' />
              ) : null
            }>
            {courses === null ? (
              <Select
                loading
                disabled
                placeholder={intl.formatMessage({ id: 'teacher_class.course_loading' })}
              />
            ) : courses.length ? (
              <Select
                showSearch
                optionFilterProp='label'
                options={courseOptions}
                placeholder={intl.formatMessage({ id: 'teacher_class.course_placeholder' })}
              />
            ) : (
              <Input placeholder='course-v1:Robbo+Scratch+2026' />
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!inviteOpen}
        title={<FormattedMessage id='teacher_class.invite_title' />}
        onCancel={() => setInviteOpen(null)}
        footer={[
          <Button key='close' type='primary' onClick={() => setInviteOpen(null)}>
            <FormattedMessage id='common.done' />
          </Button>,
        ]}>
        {inviteOpen && (
          <Space orientation='vertical' size='large' style={{ width: '100%' }}>
            <InviteDetails klass={inviteOpen} />
          </Space>
        )}
      </Modal>
    </PageContent>
  )
}

export default TeacherClassesPage
