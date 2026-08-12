import React, { useCallback, useEffect, useState } from 'react'
import {
  Button, Card, Empty, Form, Input, Modal, Space, Typography, message, List, Tag,
} from 'antd'
import { PlusOutlined, TeamOutlined, CopyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { TEACHER_CLASS_BOARD_ROUTE } from '@/constants'

const { Title, Paragraph, Text } = Typography

const TeacherClassesPage = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(null)
  const [form] = Form.useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listTeacherClasses()
      setItems(data.items || [])
    } catch (e) {
      message.error(e?.response?.data?.error || 'Failed to load classes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const onCreate = async values => {
    try {
      const { data } = await api.createTeacherClass({
        courseId: values.courseId.trim(),
        displayName: values.displayName.trim(),
      })
      message.success(intl.formatMessage({ id: 'teacher_class.created', defaultMessage: 'Class created' }))
      setCreateOpen(false)
      form.resetFields()
      setInviteOpen(data)
      load()
    } catch (e) {
      message.error(e?.response?.data?.error || 'Create failed')
    }
  }

  const copy = async text => {
    try {
      await navigator.clipboard.writeText(text)
      message.success(intl.formatMessage({ id: 'teacher_class.copied', defaultMessage: 'Copied' }))
    } catch {
      message.info(text)
    }
  }

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id='teacher_class.title' defaultMessage='My classes' />
          </SectionTitle>
          <Button type='primary' icon={<PlusOutlined />}
onClick={() => setCreateOpen(true)}>
            <FormattedMessage id='teacher_class.create' defaultMessage='Create class' />
          </Button>
        </SectionHeader>
        <Paragraph type='secondary'>
          <FormattedMessage
            id='teacher_class.hint'
            defaultMessage='Classes are Open edX cohorts on a course. Students join with a code or link.'
          />
        </Paragraph>
        {!loading && items.length === 0 && (
          <Empty description={<FormattedMessage id='teacher_class.empty' defaultMessage='No classes yet' />} />
        )}
        <List
          loading={loading}
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(TEACHER_CLASS_BOARD_ROUTE.replace(':classId', item.id))}
                actions={[
                  <Button
                    key='invite'
                    type='link'
                    icon={<CopyOutlined />}
                    onClick={e => { e.stopPropagation(); setInviteOpen(item) }}
                  >
                    <FormattedMessage id='teacher_class.invite' defaultMessage='Invite' />
                  </Button>,
                  <Button
                    key='open'
                    type='link'
                    icon={<TeamOutlined />}
                    onClick={e => {
                      e.stopPropagation()
                      navigate(TEACHER_CLASS_BOARD_ROUTE.replace(':classId', item.id))
                    }}
                  >
                    <FormattedMessage id='teacher_class.open_board' defaultMessage='Board' />
                  </Button>,
                ]}
              >
                <Title level={4} style={{ marginTop: 0 }}>{item.displayName}</Title>
                <Text type='secondary' style={{ fontSize: 12 }}>{item.edxCourseId}</Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color='blue'>{item.inviteCode}</Tag>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Panel>

      <Modal
        open={createOpen}
        title={<FormattedMessage id='teacher_class.create' defaultMessage='Create class' />}
        onCancel={() => setCreateOpen(false)}
        onOk={() => form.submit()}
        okText={<FormattedMessage id='teacher_class.create' defaultMessage='Create class' />}
      >
        <Form form={form} layout='vertical'
onFinish={onCreate}>
          <Form.Item
            name='displayName'
            label={<FormattedMessage id='teacher_class.name' defaultMessage='Class name' />}
            rules={[{ required: true }]}
          >
            <Input placeholder='10А' />
          </Form.Item>
          <Form.Item
            name='courseId'
            label={<FormattedMessage id='teacher_class.course_id' defaultMessage='edX course id' />}
            rules={[{ required: true }]}
            extra='course-v1:Org+Course+Run'
          >
            <Input placeholder='course-v1:Robbo+Scratch+2026' />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!inviteOpen}
        title={<FormattedMessage id='teacher_class.invite_title' defaultMessage='Invite students' />}
        onCancel={() => setInviteOpen(null)}
        footer={[
          <Button key='close' onClick={() => setInviteOpen(null)}>OK</Button>,
        ]}
      >
        {inviteOpen && (
          <Space direction='vertical' size='large'
style={{ width: '100%' }}>
            <div>
              <Text type='secondary'><FormattedMessage id='teacher_class.code' defaultMessage='Code' /></Text>
              <Title
                level={2}
                style={{ margin: '8px 0', letterSpacing: 4, cursor: 'pointer' }}
                onClick={() => copy(inviteOpen.inviteCode)}
              >
                {inviteOpen.inviteCode}
              </Title>
              <Button icon={<CopyOutlined />} onClick={() => copy(inviteOpen.inviteCode)}>
                <FormattedMessage id='teacher_class.copy_code' defaultMessage='Copy code' />
              </Button>
            </div>
            <div>
              <Text type='secondary'><FormattedMessage id='teacher_class.link' defaultMessage='Link' /></Text>
              <Paragraph copyable={{ text: inviteOpen.joinUrl }} style={{ marginBottom: 8 }}>
                {inviteOpen.joinUrl}
              </Paragraph>
            </div>
          </Space>
        )}
      </Modal>
    </PageContent>
  )
}

export default TeacherClassesPage
