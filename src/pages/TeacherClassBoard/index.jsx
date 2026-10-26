import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  CheckOutlined,
  CopyOutlined,
  MailOutlined,
  MoreOutlined,
  ProjectOutlined,
  ReloadOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'

import { REVIEW_STATUS_COLOR, isHandedIn, reviewStatusLabel } from './reviewStatus'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { fetchTeacherNotificationQuota, teacherSendNotification } from '@/api/notifications'
import { projectPageQueryGQL } from '@/graphQL/query/projectPage'
import { PROJECT_PAGE_ROUTE, TEACHER_CLASSES_ROUTE } from '@/constants'
import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'
import InviteDetails, { copyText } from '@/pages/TeacherClasses/InviteDetails'

const { Text } = Typography
const { TextArea } = Input

const TeacherClassBoardPage = () => {
  const { classId } = useParams()
  const intl = useIntl()
  const navigate = useNavigate()
  const [klass, setKlass] = useState(null)
  const [mode, setMode] = useState('lesson')
  const [members, setMembers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [activeAssignmentId, setActiveAssignmentId] = useState(undefined)
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState({ assignments: [], rows: [] })
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [reviewProject, setReviewProject] = useState(null)
  const [reviewComment, setReviewComment] = useState('')
  // Students the message modal is open for; null when closed.
  const [messageTo, setMessageTo] = useState(null)
  const [sending, setSending] = useState(false)
  // { limit, used, remaining } for the last 24 hours; null while unknown.
  const [messageQuota, setMessageQuota] = useState(null)
  const [form] = Form.useForm()
  const [membersForm] = Form.useForm()
  const [renameForm] = Form.useForm()
  const [messageForm] = Form.useForm()
  const required = { required: true, message: intl.formatMessage({ id: 'form.required' }) }
  const fail = (e, fallbackId = 'errors.generic') =>
    message.error(apiErrorMessage(e, intl, fallbackId))

  // Templates are the teacher's own projects; GraphQL works with the BFF session (no JWT needed).
  const { data: templatesData } = useQuery(projectPageQueryGQL.GET_PROJECT_PAGES_BY_ACCESS_TOKEN, {
    variables: { page: '1', pageSize: '50' },
    fetchPolicy: 'cache-and-network',
  })
  const templates = templatesData?.GetAllProjectPagesByAccessToken?.projectPages || []

  const loadAssignments = useCallback(async () => {
    const { data } = await api.listAssignments(classId)
    const items = data.items || []
    setAssignments(items)
    setActiveAssignmentId(current => current || items[0]?.id)
  }, [classId])

  const refreshBoard = useCallback(async () => {
    setLoading(true)
    try {
      const [classRes, membersRes, progressRes] = await Promise.all([
        api.getTeacherClass(classId),
        api.listMembers(classId),
        api.progressMatrix(classId),
        loadAssignments(),
      ])
      setKlass(classRes.data)
      setMembers(membersRes.data.items || [])
      setProgress({
        assignments: progressRes.data.assignments || [],
        rows: progressRes.data.rows || [],
      })
    } catch (e) {
      fail(e, 'teacher_board.load_error')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, loadAssignments, intl])

  const refreshAssignment = useCallback(async () => {
    if (!activeAssignmentId) {
      setSubmissions([])
      return
    }
    try {
      const { data } = await api.listSubmissions(classId, activeAssignmentId)
      setSubmissions(data.items || [])
    } catch (e) {
      fail(e, 'teacher_board.load_error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, activeAssignmentId, intl])

  useEffect(() => {
    refreshBoard()
  }, [refreshBoard])
  useEffect(() => {
    refreshAssignment()
  }, [refreshAssignment])

  const refreshAll = () => Promise.all([refreshBoard(), refreshAssignment()])

  const activeAssignment = assignments.find(a => a.id === activeAssignmentId)

  const counts = useMemo(() => {
    const onReview = submissions.filter(s => s.reviewStatus === 'submitted').length
    const handedIn = submissions.filter(s => isHandedIn(s.reviewStatus)).length
    const notHandedIn = Math.max(0, members.length - handedIn)
    const pastDue = activeAssignment?.dueAt && dayjs(activeAssignment.dueAt).isBefore(dayjs())
    return { onReview, notHandedIn, overdue: pastDue ? notHandedIn : 0 }
  }, [submissions, members, activeAssignment])

  const onCreateAssignment = async values => {
    setAssigning(true)
    try {
      await api.createAssignment(classId, {
        title: values.title.trim(),
        instructions: values.instructions || '',
        templateProjectId: values.templateProjectId,
        dueAt: values.dueAt ? values.dueAt.toISOString() : undefined,
      })
      message.success(intl.formatMessage({ id: 'teacher_board.assigned' }))
      setAssignOpen(false)
      form.resetFields()
      refreshAll()
    } catch (e) {
      fail(e)
    } finally {
      setAssigning(false)
    }
  }

  const onAddMembers = async values => {
    try {
      const { data } = await api.addMembers(classId, { text: values.text })
      const missing = data.missing || []
      message.success(
        intl.formatMessage(
          { id: 'teacher_board.members_added' },
          { added: (data.added || []).length },
        ),
      )
      if (missing.length) {
        message.warning(
          intl.formatMessage(
            { id: 'teacher_board.members_missing' },
            { emails: missing.join(', ') },
          ),
        )
      }
      membersForm.resetFields()
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  // Without an LMS user id the server cannot address the student.
  const messageableMembers = members.filter(m => m.userId)

  const openMessage = targets => {
    messageForm.resetFields()
    setMessageTo(targets)
    setMessageQuota(null)
    fetchTeacherNotificationQuota()
      .then(setMessageQuota)
      .catch(() => setMessageQuota(null))
  }
  const quotaExhausted = messageQuota?.limit > 0 && messageQuota.remaining === 0

  const onSendMessage = async values => {
    setSending(true)
    try {
      const { sent, quota } = await teacherSendNotification({
        recipientUserIds: messageTo.map(m => m.userId),
        title: values.title.trim(),
        body: values.body.trim(),
      })
      message.success(
        quota?.limit > 0
          ? intl.formatMessage(
              { id: 'teacher_board.message_sent_left' },
              { count: sent, remaining: quota.remaining, limit: quota.limit },
            )
          : intl.formatMessage({ id: 'teacher_board.message_sent' }, { count: sent }),
      )
      setMessageTo(null)
    } catch (e) {
      fail(e)
    } finally {
      setSending(false)
    }
  }

  const onRemoveMember = async member => {
    try {
      await api.removeMember(classId, member.username)
      message.success(intl.formatMessage({ id: 'teacher_board.member_removed' }))
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  const onIssueLate = async () => {
    if (!activeAssignmentId) return
    try {
      const { data } = await api.issueLate(classId, activeAssignmentId)
      message.success(
        intl.formatMessage({ id: 'teacher_board.issued_late' }, { count: data.issued || 0 }),
      )
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  const onRename = async values => {
    try {
      const { data } = await api.renameTeacherClass(classId, values.displayName.trim())
      setKlass(data)
      setRenameOpen(false)
      message.success(intl.formatMessage({ id: 'teacher_board.renamed' }))
    } catch (e) {
      fail(e)
    }
  }

  const onRotateInvite = async () => {
    try {
      const { data } = await api.rotateInvite(classId)
      setKlass(data)
      message.success(intl.formatMessage({ id: 'teacher_board.invite_rotated' }))
    } catch (e) {
      fail(e)
    }
  }

  const onArchive = async () => {
    try {
      await api.archiveTeacherClass(classId)
      message.success(intl.formatMessage({ id: 'teacher_board.archived' }))
      navigate(TEACHER_CLASSES_ROUTE)
    } catch (e) {
      fail(e)
    }
  }

  const doReview = async status => {
    if (!reviewProject) return
    try {
      await api.reviewSubmission(reviewProject.projectId, { status, comment: reviewComment })
      message.success(intl.formatMessage({ id: 'teacher_board.review_saved' }))
      setReviewProject(null)
      setReviewComment('')
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  const statusTag = status =>
    status ? (
      <Tag color={REVIEW_STATUS_COLOR[status] || 'default'}>{reviewStatusLabel(intl, status)}</Tag>
    ) : null

  // A raw LMS user id means nothing to the teacher: fall back to roster data, then to "Student".
  const studentLabel = s => {
    const m = s.userId ? members.find(x => x.userId === s.userId) : null
    return (
      s.name ||
      m?.name ||
      s.username ||
      m?.username ||
      intl.formatMessage({ id: 'teacher_board.student' })
    )
  }

  // Progress rows: the class roster with each student's cells from /progress (keyed by user id).
  const progressRows = useMemo(() => {
    const cellsByUser = new Map(progress.rows.map(r => [r.userId, r.cells || []]))
    return members.map(m => ({ ...m, cells: (m.userId && cellsByUser.get(m.userId)) || [] }))
  }, [members, progress.rows])

  const progressColumns = [
    {
      title: intl.formatMessage({ id: 'teacher_board.student' }),
      dataIndex: 'name',
      fixed: 'left',
      render: (_, row) => studentLabel(row),
    },
    ...progress.assignments.map(a => ({
      title: a.title,
      key: a.id,
      render: (_, row) =>
        statusTag((row.cells || []).find(c => c.assignmentId === a.id)?.status || 'missing'),
    })),
  ]

  const classMenu = {
    items: [
      { key: 'rename', label: intl.formatMessage({ id: 'teacher_board.rename' }) },
      { key: 'rotate', label: intl.formatMessage({ id: 'teacher_board.rotate_invite' }) },
      { type: 'divider' },
      { key: 'archive', danger: true, label: intl.formatMessage({ id: 'teacher_board.archive' }) },
    ],
    onClick: ({ key }) => {
      if (key === 'rename') {
        renameForm.setFieldsValue({ displayName: klass?.displayName || '' })
        setRenameOpen(true)
      } else if (key === 'rotate') {
        Modal.confirm({
          title: intl.formatMessage({ id: 'teacher_board.rotate_invite_confirm' }),
          okText: intl.formatMessage({ id: 'teacher_board.rotate_invite' }),
          cancelText: intl.formatMessage({ id: 'common.cancel' }),
          onOk: onRotateInvite,
        })
      } else if (key === 'archive') {
        Modal.confirm({
          title: intl.formatMessage({ id: 'teacher_board.archive_confirm' }),
          okText: intl.formatMessage({ id: 'teacher_board.archive' }),
          okButtonProps: { danger: true },
          cancelText: intl.formatMessage({ id: 'common.cancel' }),
          onOk: onArchive,
        })
      }
    },
  }

  // Lesson cards: the roster already loaded for the board plus each student's assignment project.
  // Built here so the page asks Open edX for the class roster once, not once per endpoint.
  const lessonCards = useMemo(() => {
    const byOwner = new Map(submissions.map(s => [s.ownerUserId, s]))
    return members.map(m => {
      const p = m.userId ? byOwner.get(m.userId) : undefined
      return {
        ...m,
        projectId: p?.projectId,
        projectTitle: p?.title,
        updatedAt: p?.updatedAt,
        reviewStatus: p?.reviewStatus,
        savedToday: p ? dayjs(p.updatedAt).isSame(dayjs(), 'day') : false,
      }
    })
  }, [members, submissions])

  return (
    <PageContent>
      <Panel>
        <SectionHeader>
          <div style={{ minWidth: 0 }}>
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => navigate(TEACHER_CLASSES_ROUTE)}>
              ← <FormattedMessage id='teacher_class.title' />
            </Button>
            <SectionTitle>{klass?.displayName || '…'}</SectionTitle>
            <Text type='secondary'>{klass?.edxCourseId}</Text>
          </div>
          <Space wrap>
            <Tag color='processing'>
              <FormattedMessage id='teacher_board.on_review' />: {counts.onReview}
            </Tag>
            <Tag>
              <FormattedMessage id='teacher_board.missing' />: {counts.notHandedIn}
            </Tag>
            {counts.overdue > 0 ? (
              <Tag color='error'>
                <FormattedMessage id='teacher_board.overdue' />: {counts.overdue}
              </Tag>
            ) : null}
            <Button icon={<UserAddOutlined />} onClick={() => setMembersOpen(true)}>
              <FormattedMessage id='teacher_board.students' />
            </Button>
            <Button
              icon={<MailOutlined />}
              disabled={messageableMembers.length === 0}
              onClick={() => openMessage(messageableMembers)}>
              <FormattedMessage id='teacher_board.message_class' />
            </Button>
            <Button
              icon={<CopyOutlined />}
              disabled={!klass}
              onClick={() => klass && copyText(klass.inviteCode, intl)}
              title={intl.formatMessage({ id: 'teacher_class.copy_code' })}>
              {klass?.inviteCode}
            </Button>
            <Button type='primary' icon={<ProjectOutlined />} onClick={() => setAssignOpen(true)}>
              <FormattedMessage id='teacher_board.assign' />
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshAll}
              aria-label={intl.formatMessage({ id: 'teacher_board.refresh' })}
            />
            <Dropdown menu={classMenu} trigger={['click']}>
              <Button
                icon={<MoreOutlined />}
                aria-label={intl.formatMessage({ id: 'teacher_board.class_actions' })}
              />
            </Dropdown>
          </Space>
        </SectionHeader>

        <Space style={{ marginBottom: 16 }} wrap>
          <Text>
            <FormattedMessage id='teacher_board.assignment' />:
          </Text>
          <Select
            style={{ minWidth: 240 }}
            value={activeAssignmentId}
            onChange={setActiveAssignmentId}
            options={assignments.map(a => ({ value: a.id, label: a.title }))}
            placeholder={intl.formatMessage({ id: 'teacher_board.no_assignments' })}
            notFoundContent={intl.formatMessage({ id: 'teacher_board.no_assignments' })}
          />
          {activeAssignment?.dueAt ? (
            <Text type='secondary'>
              <FormattedMessage
                id='teacher_board.due'
                values={{ when: formatDateTime(activeAssignment.dueAt, intl.locale) }}
              />
            </Text>
          ) : null}
        </Space>

        <Tabs
          activeKey={mode}
          onChange={setMode}
          items={[
            {
              key: 'lesson',
              label: <FormattedMessage id='teacher_board.tab_lesson' />,
              children:
                !loading && members.length === 0 ? (
                  <Empty description={<FormattedMessage id='teacher_board.no_students' />} />
                ) : (
                  <Row gutter={[16, 16]}>
                    {lessonCards.map(s => (
                      <Col xs={24} sm={12} md={8} lg={6} key={s.userId || s.username}>
                        <Card
                          size='small'
                          title={studentLabel(s)}
                          extra={
                            s.savedToday ? (
                              <Tag color='green'>
                                <FormattedMessage id='teacher_board.saved_today' />
                              </Tag>
                            ) : null
                          }
                          actions={
                            s.projectId
                              ? [
                                  <Button
                                    key='open'
                                    type='link'
                                    onClick={() =>
                                      setReviewProject({
                                        projectId: s.projectId,
                                        title: s.projectTitle,
                                        reviewStatus: s.reviewStatus,
                                      })
                                    }>
                                    <FormattedMessage id='teacher_board.preview' />
                                  </Button>,
                                ]
                              : []
                          }>
                          <Text type='secondary'>{s.projectTitle || '–'}</Text>
                          {s.updatedAt ? (
                            <div>
                              <Text type='secondary' style={{ fontSize: 12 }}>
                                {formatDateTime(s.updatedAt, intl.locale)}
                              </Text>
                            </div>
                          ) : null}
                          {statusTag(s.reviewStatus)}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
            },
            {
              key: 'hw',
              label: <FormattedMessage id='teacher_board.tab_hw' />,
              children: (
                <List
                  loading={loading}
                  dataSource={submissions}
                  locale={{ emptyText: intl.formatMessage({ id: 'teacher_board.no_submissions' }) }}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button
                          key='rev'
                          type='link'
                          onClick={() => {
                            setReviewProject(item)
                            setReviewComment(item.reviewComment || '')
                          }}>
                          <FormattedMessage id='teacher_board.review' />
                        </Button>,
                      ]}>
                      <List.Item.Meta
                        title={item.title}
                        description={
                          <Space wrap>
                            <Text type='secondary'>
                              {studentLabel({ userId: item.ownerUserId })}
                            </Text>
                            {statusTag(item.reviewStatus)}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'progress',
              label: <FormattedMessage id='teacher_board.tab_progress' />,
              children: (
                <Table
                  rowKey={r => r.userId || r.username}
                  loading={loading}
                  dataSource={progressRows}
                  columns={progressColumns}
                  pagination={false}
                  scroll={{ x: true }}
                  locale={{ emptyText: intl.formatMessage({ id: 'teacher_board.no_students' }) }}
                />
              ),
            },
          ]}
        />
      </Panel>

      <Modal
        open={assignOpen}
        title={<FormattedMessage id='teacher_board.assign' />}
        onCancel={() => setAssignOpen(false)}
        onOk={() => form.submit()}
        okText={<FormattedMessage id='teacher_board.assign_submit' />}
        cancelText={<FormattedMessage id='common.cancel' />}
        confirmLoading={assigning}>
        <Form form={form} layout='vertical' onFinish={onCreateAssignment}>
          <Form.Item
            name='title'
            label={<FormattedMessage id='teacher_board.field_title' />}
            rules={[required]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='instructions'
            label={<FormattedMessage id='teacher_board.field_instructions' />}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name='templateProjectId'
            label={<FormattedMessage id='teacher_board.field_template' />}
            rules={[required]}
            extra={templates.length ? null : <FormattedMessage id='teacher_board.template_hint' />}>
            <Select
              showSearch
              optionFilterProp='label'
              options={templates.map(t => ({
                value: t.projectPageId,
                label: t.title || intl.formatMessage({ id: 'project_card.untitled' }),
              }))}
              placeholder={intl.formatMessage({ id: 'teacher_board.template_placeholder' })}
            />
          </Form.Item>
          <Form.Item name='dueAt' label={<FormattedMessage id='teacher_board.field_due' />}>
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format='DD.MM.YYYY HH:mm'
              style={{ width: '100%' }}
              disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={membersOpen}
        title={<FormattedMessage id='teacher_board.students' />}
        onCancel={() => setMembersOpen(false)}
        footer={null}
        width={640}>
        {klass ? (
          <Space orientation='vertical' size='middle' style={{ width: '100%', marginBottom: 16 }}>
            <InviteDetails klass={klass} />
          </Space>
        ) : null}
        <Form form={membersForm} layout='vertical' onFinish={onAddMembers}>
          <Form.Item
            name='text'
            label={<FormattedMessage id='teacher_board.add_by_email' />}
            rules={[required]}>
            <TextArea rows={4} placeholder='student@school.ru' />
          </Form.Item>
          <Button type='primary' htmlType='submit' icon={<UserAddOutlined />}>
            <FormattedMessage id='teacher_board.add' />
          </Button>
        </Form>
        <List
          style={{ marginTop: 16 }}
          size='small'
          header={intl.formatMessage(
            { id: 'teacher_board.members_count' },
            { count: members.length },
          )}
          dataSource={members}
          locale={{ emptyText: intl.formatMessage({ id: 'teacher_board.no_students' }) }}
          renderItem={m => (
            <List.Item
              actions={[
                <Button key='msg' type='link' disabled={!m.userId} onClick={() => openMessage([m])}>
                  <FormattedMessage id='teacher_board.message' />
                </Button>,
                <Popconfirm
                  key='rm'
                  title={intl.formatMessage(
                    { id: 'teacher_board.remove_confirm' },
                    { name: m.name || m.username },
                  )}
                  okText={intl.formatMessage({ id: 'teacher_board.remove' })}
                  okButtonProps={{ danger: true }}
                  cancelText={intl.formatMessage({ id: 'common.cancel' })}
                  onConfirm={() => onRemoveMember(m)}>
                  <Button type='link' danger>
                    <FormattedMessage id='teacher_board.remove' />
                  </Button>
                </Popconfirm>,
              ]}>
              {m.name || m.username}
              {m.email ? ` · ${m.email}` : ''}
            </List.Item>
          )}
        />
        {activeAssignment ? (
          <Popconfirm
            title={intl.formatMessage(
              { id: 'teacher_board.issue_late_confirm' },
              { title: activeAssignment.title },
            )}
            okText={intl.formatMessage({ id: 'teacher_board.issue_late' })}
            cancelText={intl.formatMessage({ id: 'common.cancel' })}
            onConfirm={onIssueLate}>
            <Button style={{ marginTop: 8 }}>
              <FormattedMessage id='teacher_board.issue_late' />
            </Button>
          </Popconfirm>
        ) : null}
      </Modal>

      <Modal
        open={!!messageTo}
        title={
          messageTo?.length === 1
            ? intl.formatMessage(
                { id: 'teacher_board.message_to' },
                { name: messageTo[0].name || messageTo[0].username },
              )
            : intl.formatMessage(
                { id: 'teacher_board.message_to_class' },
                { count: messageTo?.length || 0 },
              )
        }
        onCancel={() => setMessageTo(null)}
        onOk={() => messageForm.submit()}
        okText={<FormattedMessage id='teacher_board.message_send' />}
        okButtonProps={{ loading: sending, disabled: quotaExhausted }}
        cancelText={<FormattedMessage id='common.cancel' />}>
        {messageQuota?.limit > 0 ? (
          <Text
            type={quotaExhausted ? 'danger' : 'secondary'}
            style={{ display: 'block', marginBottom: 12 }}>
            {intl.formatMessage(
              {
                id: quotaExhausted
                  ? 'teacher_board.message_daily_limit'
                  : 'teacher_board.message_quota',
              },
              { remaining: messageQuota.remaining, limit: messageQuota.limit },
            )}
          </Text>
        ) : null}
        <Text type='secondary' style={{ display: 'block', marginBottom: 12 }}>
          <FormattedMessage id='teacher_board.message_name_hint' />
        </Text>
        <Form form={messageForm} layout='vertical' onFinish={onSendMessage}>
          <Form.Item
            name='title'
            label={<FormattedMessage id='teacher_board.message_title' />}
            rules={[required, { whitespace: true, message: required.message }]}>
            <Input maxLength={200} showCount />
          </Form.Item>
          <Form.Item
            name='body'
            label={<FormattedMessage id='teacher_board.message_body' />}
            rules={[required, { whitespace: true, message: required.message }]}>
            <TextArea rows={4} maxLength={2000} showCount />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={renameOpen}
        title={<FormattedMessage id='teacher_board.rename' />}
        onCancel={() => setRenameOpen(false)}
        onOk={() => renameForm.submit()}
        okText={<FormattedMessage id='common.save' />}
        cancelText={<FormattedMessage id='common.cancel' />}>
        <Form form={renameForm} layout='vertical' onFinish={onRename}>
          <Form.Item
            name='displayName'
            label={<FormattedMessage id='teacher_class.name' />}
            rules={[required]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!reviewProject}
        title={reviewProject?.title || intl.formatMessage({ id: 'teacher_board.review' })}
        onCancel={() => setReviewProject(null)}
        width={900}
        footer={
          <Space wrap>
            <Button onClick={() => doReview('returned')}>
              <FormattedMessage id='teacher_board.review_return' />
            </Button>
            <Button onClick={() => doReview('shown_in_class')}>
              <FormattedMessage id='teacher_board.review_shown' />
            </Button>
            <Button type='primary' icon={<CheckOutlined />} onClick={() => doReview('accepted')}>
              <FormattedMessage id='teacher_board.review_accept' />
            </Button>
          </Space>
        }>
        {reviewProject?.projectId ? (
          <div style={{ marginBottom: 16 }}>
            <ScratchPlayerEmbed projectPageId={reviewProject.projectId} />
            <Button
              type='link'
              href={PROJECT_PAGE_ROUTE.replace(':projectPageId', reviewProject.projectId)}
              target='_blank'>
              <FormattedMessage id='teacher_board.open_project' />
            </Button>
          </div>
        ) : null}
        <TextArea
          rows={3}
          value={reviewComment}
          onChange={e => setReviewComment(e.target.value)}
          placeholder={intl.formatMessage({ id: 'teacher_board.comment_placeholder' })}
          aria-label={intl.formatMessage({ id: 'teacher_board.comment_placeholder' })}
        />
      </Modal>
    </PageContent>
  )
}

export default TeacherClassBoardPage
