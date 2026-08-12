import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, Tabs, Tag,
  Typography, message, Empty, List,
} from 'antd'
import {
  CheckOutlined, ReloadOutlined, UserAddOutlined, ProjectOutlined, CopyOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { projectPageAPI } from '@/api/projectPage'
import { TEACHER_CLASSES_ROUTE, PROJECT_PAGE_ROUTE } from '@/constants'
import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'

const { Text, Paragraph } = Typography
const { TextArea } = Input

const formatTime = iso => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return String(iso)
  }
}
const statusColor = {
  draft: 'default',
  submitted: 'processing',
  returned: 'warning',
  accepted: 'success',
  shown_in_class: 'cyan',
  missing: 'error',
}

const TeacherClassBoardPage = () => {
  const { classId } = useParams()
  const intl = useIntl()
  const navigate = useNavigate()
  const [klass, setKlass] = useState(null)
  const [mode, setMode] = useState('lesson')
  const [members, setMembers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [activeAssignmentId, setActiveAssignmentId] = useState(undefined)
  const [live, setLive] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState({ assignments: [], rows: [] })
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [templates, setTemplates] = useState([])
  const [reviewProject, setReviewProject] = useState(null)
  const [reviewComment, setReviewComment] = useState('')
  const [form] = Form.useForm()
  const [membersForm] = Form.useForm()

  const loadClass = useCallback(async () => {
    const { data } = await api.getTeacherClass(classId)
    setKlass(data)
  }, [classId])

  const loadMembers = useCallback(async () => {
    const { data } = await api.listMembers(classId)
    setMembers(data.items || [])
  }, [classId])

  const loadAssignments = useCallback(async () => {
    const { data } = await api.listAssignments(classId)
    const items = data.items || []
    setAssignments(items)
    if (!activeAssignmentId && items[0]) {
      setActiveAssignmentId(items[0].id)
    }
  }, [classId, activeAssignmentId])

  const refreshBoard = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([loadClass(), loadMembers(), loadAssignments()])
      if (activeAssignmentId) {
        const [liveRes, subRes] = await Promise.all([
          api.liveRoster(classId, activeAssignmentId),
          api.listSubmissions(classId, activeAssignmentId),
        ])
        setLive(liveRes.data.items || [])
        setSubmissions(subRes.data.items || [])
      }
      const prog = await api.progressMatrix(classId)
      setProgress({ assignments: prog.data.assignments || [], rows: prog.data.rows || [] })
    } catch (e) {
      message.error(e?.response?.data?.error || 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [classId, activeAssignmentId, loadClass, loadMembers, loadAssignments])

  useEffect(() => { refreshBoard() }, [refreshBoard])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    projectPageAPI.getAllProjectPages(token).then(res => {
      const pages = res?.data?.projectPages || []
      setTemplates(Array.isArray(pages) ? pages : [])
    }).catch(() => setTemplates([]))
  }, [])

  const counts = useMemo(() => {
    const submitted = submissions.filter(s => s.reviewStatus === 'submitted').length
    const missing = Math.max(0, members.length - submissions.filter(s => s.reviewStatus && s.reviewStatus !== 'draft').length)
    const overdue = 0
    return { submitted, missing, overdue }
  }, [submissions, members])

  const onCreateAssignment = async values => {
    try {
      await api.createAssignment(classId, {
        title: values.title,
        instructions: values.instructions || '',
        assignmentKey: values.assignmentKey || undefined,
        templateProjectId: values.templateProjectId,
        dueAt: values.dueAt
          ? (typeof values.dueAt.toISOString === 'function'
            ? values.dueAt.toISOString()
            : new Date(values.dueAt).toISOString())
          : undefined,
      })
      message.success('Assignment issued')
      setAssignOpen(false)
      form.resetFields()
      refreshBoard()
    } catch (e) {
      message.error(e?.response?.data?.error || 'Failed')
    }
  }

  const onAddMembers = async values => {
    try {
      const { data } = await api.addMembers(classId, { text: values.text })
      message.success(`Added: ${(data.added || []).length}. Missing: ${(data.missing || []).join(', ') || '—'}`)
      setMembersOpen(false)
      membersForm.resetFields()
      refreshBoard()
    } catch (e) {
      message.error(e?.response?.data?.error || 'Failed')
    }
  }

  const doReview = async status => {
    if (!reviewProject) return
    try {
      await api.reviewSubmission(reviewProject.projectId, { status, comment: reviewComment })
      message.success('Updated')
      setReviewProject(null)
      setReviewComment('')
      refreshBoard()
    } catch (e) {
      message.error(e?.response?.data?.error || 'Failed')
    }
  }

  const progressColumns = [
    {
      title: intl.formatMessage({ id: 'teacher_board.student', defaultMessage: 'Student' }),
      dataIndex: 'name',
      render: (_, row) => row.name || row.username || row.userId,
    },
    ...progress.assignments.map(a => ({
      title: a.title,
      key: a.id,
      render: (_, row) => {
        const cell = (row.cells || []).find(c => c.assignmentId === a.id)
        const st = cell?.status || 'missing'
        return <Tag color={statusColor[st] || 'default'}>{st}</Tag>
      },
    })),
  ]

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <div>
            <Button type='link' style={{ paddingLeft: 0 }}
onClick={() => navigate(TEACHER_CLASSES_ROUTE)}>
              ← <FormattedMessage id='teacher_class.title' defaultMessage='My classes' />
            </Button>
            <SectionTitle>{klass?.displayName || '…'}</SectionTitle>
            <Text type='secondary'>{klass?.edxCourseId}</Text>
          </div>
          <Space wrap>
            <Tag color='processing'><FormattedMessage id='teacher_board.on_review' defaultMessage='On review' />: {counts.submitted}</Tag>
            <Tag><FormattedMessage id='teacher_board.missing' defaultMessage='Missing' />: {counts.missing}</Tag>
            <Button icon={<UserAddOutlined />} onClick={() => setMembersOpen(true)}>
              <FormattedMessage id='teacher_board.students' defaultMessage='Students' />
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => klass && navigator.clipboard.writeText(klass.inviteCode)}>
              {klass?.inviteCode}
            </Button>
            <Button type='primary' icon={<ProjectOutlined />}
onClick={() => setAssignOpen(true)}>
              <FormattedMessage id='teacher_board.assign' defaultMessage='Assign work' />
            </Button>
            <Button icon={<ReloadOutlined />} onClick={refreshBoard} />
          </Space>
        </SectionHeader>

        <Space style={{ marginBottom: 16 }} wrap>
          <Text><FormattedMessage id='teacher_board.assignment' defaultMessage='Assignment' />:</Text>
          <Select
            style={{ minWidth: 220 }}
            value={activeAssignmentId}
            onChange={setActiveAssignmentId}
            options={assignments.map(a => ({ value: a.id, label: a.title }))}
            placeholder='Select assignment'
          />
        </Space>

        <Tabs
          activeKey={mode}
          onChange={setMode}
          items={[
            {
              key: 'lesson',
              label: <FormattedMessage id='teacher_board.tab_lesson' defaultMessage='Lesson' />,
              children: (
                <Row gutter={[16, 16]}>
                  {(live.length ? live : members.map(m => ({
                    userId: m.userId, username: m.username, name: m.name, email: m.email,
                  }))).map(s => (
                    <Col xs={24} sm={12}
md={8} lg={6}
key={s.userId || s.username}>
                      <Card
                        size='small'
                        title={s.name || s.username}
                        extra={s.savedToday ? <Tag color='green'>today</Tag> : null}
                        actions={s.projectId ? [
                          <Button
                            key='open'
                            type='link'
                            onClick={() => setReviewProject({
                              projectId: s.projectId,
                              title: s.projectTitle,
                              reviewStatus: s.reviewStatus,
                            })}
                          >
                            Preview
                          </Button>,
                        ] : []}
                      >
                        <Text type='secondary'>{s.projectTitle || '—'}</Text>
                        {s.updatedAt && (
                          <div><Text type='secondary' style={{ fontSize: 12 }}>{formatTime(s.updatedAt)}</Text></div>
                        )}
                        {s.reviewStatus && <Tag color={statusColor[s.reviewStatus]}>{s.reviewStatus}</Tag>}
                      </Card>
                    </Col>
                  ))}
                  {!loading && members.length === 0 && (
                    <Col span={24}><Empty description='No students yet — share the invite code' /></Col>
                  )}
                </Row>
              ),
            },
            {
              key: 'hw',
              label: <FormattedMessage id='teacher_board.tab_hw' defaultMessage='Homework' />,
              children: (
                <List
                  loading={loading}
                  dataSource={submissions}
                  locale={{ emptyText: 'No submissions for this assignment' }}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button key='rev' type='link'
onClick={() => {
                          setReviewProject(item)
                          setReviewComment(item.reviewComment || '')
                        }}
                        >
                          Review
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={(
                          <Space>
                            <Text type='secondary'>{item.ownerUserId}</Text>
                            <Tag color={statusColor[item.reviewStatus]}>{item.reviewStatus}</Tag>
                          </Space>
                        )}
                      />
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'progress',
              label: <FormattedMessage id='teacher_board.tab_progress' defaultMessage='Progress' />,
              children: (
                <Table
                  rowKey={r => r.userId || r.username}
                  loading={loading}
                  dataSource={progress.rows}
                  columns={progressColumns}
                  pagination={false}
                  scroll={{ x: true }}
                />
              ),
            },
          ]}
        />
      </Panel>

      <Modal
        open={assignOpen}
        title={<FormattedMessage id='teacher_board.assign' defaultMessage='Assign work' />}
        onCancel={() => setAssignOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout='vertical'
onFinish={onCreateAssignment}>
          <Form.Item name='title' label='Title'
rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='instructions' label='Instructions'>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name='templateProjectId' label='Scratch template'
rules={[{ required: true }]}>
            <Select
              showSearch
              optionFilterProp='label'
              options={(Array.isArray(templates) ? templates : []).map(t => ({
                value: t.projectPageId || t.projectId || t.id,
                label: t.title || t.name || t.projectPageId,
              }))}
              placeholder='Create a template in My projects first'
            />
          </Form.Item>
          <Form.Item name='dueAt' label='Due'>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={membersOpen}
        title={<FormattedMessage id='teacher_board.students' defaultMessage='Students' />}
        onCancel={() => setMembersOpen(false)}
        footer={null}
        width={640}
      >
        <Paragraph>
          Code: <Text strong copyable>{klass?.inviteCode}</Text>
          {' · '}
          <Text copyable={{ text: klass?.joinUrl }}>{klass?.joinUrl}</Text>
        </Paragraph>
        <Form form={membersForm} layout='vertical'
onFinish={onAddMembers}>
          <Form.Item
            name='text'
            label='Add by email (comma or newline)'
            rules={[{ required: true }]}
          >
            <TextArea rows={4} placeholder='student@school.ru' />
          </Form.Item>
          <Button type='primary' htmlType='submit'
icon={<UserAddOutlined />}>Add
          </Button>
        </Form>
        <List
          style={{ marginTop: 16 }}
          size='small'
          header={`${members.length} students`}
          dataSource={members}
          renderItem={m => (
            <List.Item
              actions={[
                <Button
                  key='rm'
                  type='link'
                  danger
                  onClick={async () => {
                    await api.removeMember(classId, m.username)
                    refreshBoard()
                  }}
                >
                  Remove
                </Button>,
              ]}
            >
              {m.name || m.username} · {m.email}
            </List.Item>
          )}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            if (!activeAssignmentId) return
            const { data } = await api.issueLate(classId, activeAssignmentId)
            message.success(`Issued to ${data.issued} latecomers`)
            refreshBoard()
          }}
        >
          Issue current assignment to latecomers
        </Button>
      </Modal>

      <Modal
        open={!!reviewProject}
        title={reviewProject?.title || 'Review'}
        onCancel={() => setReviewProject(null)}
        width={900}
        footer={(
          <Space>
            <Button onClick={() => doReview('returned')}>Return</Button>
            <Button onClick={() => doReview('shown_in_class')}>Shown in class</Button>
            <Button type='primary' icon={<CheckOutlined />}
onClick={() => doReview('accepted')}>Accept
            </Button>
          </Space>
        )}
      >
        {reviewProject?.projectId && (
          <div style={{ marginBottom: 16 }}>
            <ScratchPlayerEmbed projectPageId={reviewProject.projectId} />
            <Button
              type='link'
              href={PROJECT_PAGE_ROUTE.replace(':projectPageId', reviewProject.projectId)}
              target='_blank'
            >
              Open project page
            </Button>
          </div>
        )}
        <Input.TextArea
          rows={3}
          value={reviewComment}
          onChange={e => setReviewComment(e.target.value)}
          placeholder='Comment for student'
        />
      </Modal>
    </PageContent>
  )
}

export default TeacherClassBoardPage
