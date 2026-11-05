import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Segmented,
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
  CodeOutlined,
  CopyOutlined,
  MailOutlined,
  MoreOutlined,
  PaperClipOutlined,
  ProjectOutlined,
  ReloadOutlined,
  UndoOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from '@apollo/client/react'
import dayjs from 'dayjs'

import {
  CLOSED_TAG_PROPS,
  REVIEW_STATUS_COLOR,
  isHandedIn,
  reviewStatusLabel,
} from './reviewStatus'
import FileAssignmentFields from './FileAssignmentFields'
import ClassHistory from './ClassHistory'
import CoTeachersModal from './CoTeachersModal'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { fetchTeacherNotificationQuota, teacherSendNotification } from '@/api/notifications'
import { projectPageQueryGQL } from '@/graphQL/query/projectPage'
import { PROJECT_PAGE_ROUTE, TEACHER_CLASSES_ROUTE } from '@/constants'
import ScratchPlayerEmbed from '@/components/ScratchPlayerEmbed'
import AssignmentFiles, { FileDownloadButton } from '@/components/AssignmentFiles'
import { getEntitlements } from '@/api/licensing'
import { restoreStudentVersion } from '@/api/projectPage'
import { kindsLabel } from '@/api/userFiles'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'
import { useVisibleInterval } from '@/helpers/useVisibleInterval'
import {
  EditingNote,
  SubmissionNote,
  TeacherEditNote,
  editorLabel,
} from '@/pages/StudentClasses/AssignmentStatus'
import { openScratchEditorInNewTab } from '@/utils/scratchEditor'
import InviteDetails, { copyText } from '@/pages/TeacherClasses/InviteDetails'

const { Paragraph, Text } = Typography
const { TextArea } = Input

// Filters of the "Work" tab; "missing" is work the student still owes, returned work included.
const WORK_FILTERS = {
  review: row => row.reviewStatus === 'submitted',
  missing: row => !isHandedIn(row.reviewStatus) || row.reviewStatus === 'returned',
  reviewed: row => ['accepted', 'shown_in_class'].includes(row.reviewStatus),
  all: () => true,
}

const TeacherClassBoardPage = () => {
  const { classId } = useParams()
  const intl = useIntl()
  const navigate = useNavigate()
  const [klass, setKlass] = useState(null)
  const [mode, setMode] = useState('work')
  const [historyReload, setHistoryReload] = useState(0)
  const [workFilter, setWorkFilter] = useState('review')
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
  const [coTeachersOpen, setCoTeachersOpen] = useState(false)
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
  const assignKind = Form.useWatch('kind', form) || 'scratch'
  // File assignments need "Мои файлы" with the antivirus on (entitlements.fileAssignmentsEnabled).
  const [fileAssignments, setFileAssignments] = useState(false)
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
    // Oldest first: the board opens on the newest, the one the class is working on.
    setActiveAssignmentId(current => current || items[items.length - 1]?.id)
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
    getEntitlements()
      .then(ent => setFileAssignments(!!ent?.fileAssignmentsEnabled))
      .catch(() => setFileAssignments(false))
  }, [])
  useEffect(() => {
    refreshAssignment()
  }, [refreshAssignment])

  // Who is editing a work is live; a failed refresh keeps what is on the screen.
  useVisibleInterval(() => {
    if (!activeAssignmentId) return
    api
      .listSubmissions(classId, activeAssignmentId)
      .then(({ data }) => setSubmissions(data.items || []))
      .catch(() => {})
  }, 30000)

  const refreshAll = () => {
    setHistoryReload(n => n + 1)
    return Promise.all([refreshBoard(), refreshAssignment()])
  }

  const activeAssignment = assignments.find(a => a.id === activeAssignmentId)
  // Rename, archive, a new code and appointments stay with the owner.
  const isCoTeacher = !!klass?.coTeacherUntil

  // One row per student for the active assignment: the roster joined with the copies.
  // Handed-in work of a student who left the class keeps a row, so it can still be reviewed.
  const workRows = useMemo(() => {
    const byOwner = new Map()
    // Newest first: the latest copy wins if a student somehow has two.
    submissions.forEach(s => byOwner.has(s.ownerUserId) || byOwner.set(s.ownerUserId, s))
    const row = (m, p) => ({
      ...m,
      key: m.userId || m.username,
      projectId: p?.projectId,
      submissionId: p?.submissionId,
      files: p?.files,
      updatedAt: p?.updatedAt,
      reviewStatus: p?.reviewStatus,
      reviewComment: p?.reviewComment,
      submissionNote: p?.submissionNote,
      reviewedByName: p?.reviewedByName,
      reviewedAt: p?.reviewedAt,
      editedByName: p?.editedByName,
      editedAt: p?.editedAt,
      canEdit: !!p?.canEdit,
      canRestore: !!p?.canRestore,
      editors: p?.editors,
      title: p?.title,
      late: !!p?.late,
    })
    const rows = members.map(m => row(m, m.userId ? byOwner.get(m.userId) : undefined))
    const onRoster = new Set(members.map(m => m.userId).filter(Boolean))
    byOwner.forEach((p, owner) => {
      if (!onRoster.has(owner) && isHandedIn(p.reviewStatus)) rows.push(row({ userId: owner }, p))
    })
    return rows
  }, [members, submissions])

  const workCounts = useMemo(() => {
    const out = {}
    Object.entries(WORK_FILTERS).forEach(([key, match]) => {
      out[key] = workRows.filter(match).length
    })
    return out
  }, [workRows])
  const visibleWorkRows = useMemo(
    () => workRows.filter(WORK_FILTERS[workFilter]),
    [workRows, workFilter],
  )
  const pastDue = activeAssignment?.dueAt && dayjs(activeAssignment.dueAt).isBefore(dayjs())
  const overdue = pastDue ? workCounts.missing : 0

  const onCreateAssignment = async values => {
    setAssigning(true)
    try {
      const fileKind = values.kind === 'file'
      const { data } = await api.createAssignment(classId, {
        title: values.title.trim(),
        instructions: values.instructions || '',
        templateProjectId: fileKind ? undefined : values.templateProjectId,
        dueAt: values.dueAt ? values.dueAt.toISOString() : undefined,
        ...(fileKind
          ? {
              kind: 'file',
              allowedKinds: values.allowedKinds || [],
              templateFileId: values.templateFileId,
            }
          : {}),
      })
      message.success(intl.formatMessage({ id: 'teacher_board.assigned' }))
      // Copies that failed are retried by "Issue to latecomers"; skipped ones need an LMS account.
      if (data?.copiesFailed > 0) {
        message.warning(
          intl.formatMessage({ id: 'teacher_board.copies_failed' }, { count: data.copiesFailed }),
        )
      }
      if (data?.copiesSkipped > 0) {
        message.warning(
          intl.formatMessage({ id: 'teacher_board.copies_skipped' }, { count: data.copiesSkipped }),
        )
      }
      if (data?.id) setActiveAssignmentId(data.id)
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
        classId,
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
      // A ЛК class keys its roster by user id: the LMS login may be unknown.
      const key = klass?.lmsLinked ? member.username : member.userId || member.username
      await api.removeMember(classId, key)
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

  const onToggleClosed = async () => {
    if (!activeAssignment) return
    try {
      const closing = !activeAssignment.closedAt
      await (closing ? api.closeAssignment : api.reopenAssignment)(classId, activeAssignment.id)
      message.success(
        intl.formatMessage({
          id: closing ? 'teacher_board.closed_done' : 'teacher_board.reopened_done',
        }),
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
      const body = { status, comment: reviewComment }
      await (reviewProject.submissionId
        ? api.reviewFileSubmission(reviewProject.submissionId, body)
        : api.reviewSubmission(reviewProject.projectId, body))
      message.success(intl.formatMessage({ id: 'teacher_board.review_saved' }))
      closeReview()
      setReviewComment('')
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  // The editor is in its own tab: what was saved there shows up when the teacher comes back.
  const editorOpened = useRef(false)
  useEffect(() => {
    const onFocus = () => {
      if (editorOpened.current) refreshAll()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  })

  const openInScratch = () => {
    editorOpened.current = true
    openScratchEditorInNewTab(reviewProject.projectId)
  }

  const closeReview = () => {
    editorOpened.current = false
    setReviewProject(null)
  }

  const restoreWork = async () => {
    try {
      await restoreStudentVersion(reviewProject.projectId)
      message.success(intl.formatMessage({ id: 'teacher_board.restore_ok' }))
      refreshAll()
    } catch (e) {
      fail(e)
    }
  }

  const statusTag = status =>
    status ? (
      <Tag color={REVIEW_STATUS_COLOR[status] || 'default'}>{reviewStatusLabel(intl, status)}</Tag>
    ) : null

  const lateTag = (
    <Tag color='orange'>
      <FormattedMessage id='teacher_board.late' />
    </Tag>
  )

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

  // The modal holds the row it was opened with; this one follows the board.
  const reviewRow = workRows.find(
    row => row.projectId && row.projectId === reviewProject?.projectId,
  )

  const openWork = row => {
    setReviewProject({
      projectId: row.projectId,
      submissionId: row.submissionId,
      files: row.files || [],
      title: row.submissionId ? `${row.title} · ${studentLabel(row)}` : row.title,
      reviewStatus: row.reviewStatus,
      submissionNote: row.submissionNote,
    })
    setReviewComment(row.reviewComment || '')
  }

  const workColumns = [
    {
      title: intl.formatMessage({ id: 'teacher_board.student' }),
      key: 'student',
      render: (_, row) => studentLabel(row),
    },
    {
      title: intl.formatMessage({ id: 'teacher_board.status' }),
      key: 'status',
      render: (_, row) => (
        <Space wrap size={4}>
          {statusTag(row.reviewStatus || 'empty')}
          {row.late ? lateTag : null}
          {(row.editors || []).map(editor => (
            <Tag key={`${editor.role}:${editor.name}`} color='processing'>
              {editorLabel(intl, editor)}
            </Tag>
          ))}
          {row.files?.length ? (
            <Text type='secondary'>
              <PaperClipOutlined />{' '}
              <FormattedMessage
                id='teacher_board.files_count'
                values={{ count: row.files.length }}
              />
            </Text>
          ) : null}
          {row.reviewedByName ? (
            <Text type='secondary' title={formatDateTime(row.reviewedAt, intl.locale)}>
              <FormattedMessage
                id='teacher_board.reviewed_by'
                values={{ name: row.reviewedByName }}
              />
            </Text>
          ) : null}
          {row.editedAt ? (
            <Text type='secondary' title={formatDateTime(row.editedAt, intl.locale)}>
              <FormattedMessage
                id='teacher_board.edited_by'
                values={{ name: row.editedByName || '–' }}
              />
            </Text>
          ) : null}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'teacher_board.last_saved' }),
      key: 'saved',
      render: (_, row) =>
        row.updatedAt ? (
          <Space wrap size={4}>
            <Text type='secondary'>{formatDateTime(row.updatedAt, intl.locale)}</Text>
            {dayjs(row.updatedAt).isSame(dayjs(), 'day') ? (
              <Tag color='green'>
                <FormattedMessage id='teacher_board.saved_today' />
              </Tag>
            ) : null}
          </Space>
        ) : (
          '–'
        ),
    },
    {
      key: 'action',
      align: 'right',
      // Only work the viewer may open has an id: a teacher never gets one for a draft.
      render: (_, row) =>
        row.projectId || (row.submissionId && row.files) ? (
          <Button type='link' onClick={() => openWork(row)}>
            <FormattedMessage
              id={isHandedIn(row.reviewStatus) ? 'teacher_board.review' : 'teacher_board.preview'}
            />
          </Button>
        ) : null,
    },
  ]

  const progressColumns = [
    {
      title: intl.formatMessage({ id: 'teacher_board.student' }),
      dataIndex: 'name',
      fixed: 'left',
      render: (_, row) => studentLabel(row),
    },
    ...progress.assignments.map(a => ({
      title:
        a.kind === 'file' ? (
          <Space size={4}>
            <PaperClipOutlined aria-label={intl.formatMessage({ id: 'teacher_board.kind_file' })} />
            {a.title}
          </Space>
        ) : (
          a.title
        ),
      key: a.id,
      render: (_, row) => {
        const cell = (row.cells || []).find(c => c.assignmentId === a.id)
        return (
          <React.Fragment>
            {statusTag(cell?.status || 'missing')}
            {cell?.late ? lateTag : null}
          </React.Fragment>
        )
      },
    })),
  ]

  const classMenu = {
    items: [
      { key: 'co_teachers', label: intl.formatMessage({ id: 'co_teachers.title' }) },
      ...(isCoTeacher
        ? []
        : [
            { key: 'rename', label: intl.formatMessage({ id: 'teacher_board.rename' }) },
            { key: 'rotate', label: intl.formatMessage({ id: 'teacher_board.rotate_invite' }) },
            { type: 'divider' },
            {
              key: 'archive',
              danger: true,
              label: intl.formatMessage({ id: 'teacher_board.archive' }),
            },
          ]),
    ],
    onClick: ({ key }) => {
      if (key === 'co_teachers') {
        setCoTeachersOpen(true)
      } else if (key === 'rename') {
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

  return (
    <PageContent $wide>
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
            {isCoTeacher ? (
              <div>
                <Tag color='gold'>
                  <FormattedMessage
                    id='co_teachers.until_tag'
                    values={{ date: intl.formatDate(klass.coTeacherUntil) }}
                  />
                </Tag>
                {klass.ownerName ? (
                  <Text type='secondary'>
                    <FormattedMessage id='teacher_class.owner' values={{ name: klass.ownerName }} />
                  </Text>
                ) : null}
              </div>
            ) : null}
          </div>
          <Space wrap>
            {overdue > 0 ? (
              <Tag color='error'>
                <FormattedMessage id='teacher_board.overdue' />: {overdue}
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
          {activeAssignment?.closedAt ? (
            <Tag {...CLOSED_TAG_PROPS}>
              <FormattedMessage id='teacher_board.closed' />
            </Tag>
          ) : null}
          {activeAssignment?.kind === 'file' ? (
            <Text type='secondary'>
              <PaperClipOutlined />{' '}
              <FormattedMessage
                id='class_files.accepts'
                values={{
                  types: activeAssignment.allowedKinds?.length
                    ? kindsLabel(activeAssignment.allowedKinds)
                    : intl.formatMessage({ id: 'class_files.any_types' }),
                  max: activeAssignment.maxFiles,
                }}
              />
            </Text>
          ) : null}
          {activeAssignment?.templateFile ? (
            <FileDownloadButton
              type='link'
              file={activeAssignment.templateFile}
              download={f => api.downloadStarterFile(activeAssignment.id, f.name)}>
              <FormattedMessage id='class_files.starter' />
            </FileDownloadButton>
          ) : null}
          {activeAssignment ? (
            <Popconfirm
              title={intl.formatMessage({
                id: activeAssignment.closedAt
                  ? 'teacher_board.reopen_confirm'
                  : 'teacher_board.close_confirm',
              })}
              okText={intl.formatMessage({
                id: activeAssignment.closedAt ? 'teacher_board.reopen' : 'teacher_board.close',
              })}
              cancelText={intl.formatMessage({ id: 'common.cancel' })}
              onConfirm={onToggleClosed}>
              <Button size='small'>
                <FormattedMessage
                  id={activeAssignment.closedAt ? 'teacher_board.reopen' : 'teacher_board.close'}
                />
              </Button>
            </Popconfirm>
          ) : null}
        </Space>

        <Tabs
          activeKey={mode}
          onChange={setMode}
          items={[
            {
              key: 'work',
              label: <FormattedMessage id='teacher_board.tab_work' />,
              children: (
                <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
                  <Segmented
                    value={workFilter}
                    onChange={setWorkFilter}
                    options={Object.keys(WORK_FILTERS).map(key => ({
                      value: key,
                      label: `${intl.formatMessage({ id: `teacher_board.filter_${key}` })} · ${
                        workCounts[key]
                      }`,
                    }))}
                  />
                  <Table
                    rowKey='key'
                    loading={loading}
                    dataSource={visibleWorkRows}
                    columns={workColumns}
                    pagination={false}
                    scroll={{ x: true }}
                    locale={{
                      emptyText: intl.formatMessage({
                        id:
                          workRows.length === 0
                            ? 'teacher_board.no_students'
                            : 'teacher_board.filter_empty',
                      }),
                    }}
                  />
                </Space>
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
            {
              key: 'history',
              label: <FormattedMessage id='teacher_board.tab_history' />,
              children: (
                <ClassHistory
                  classId={classId}
                  active={mode === 'history'}
                  reloadKey={historyReload}
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
        <Form
          form={form}
          layout='vertical'
          onFinish={onCreateAssignment}
          initialValues={{ kind: 'scratch' }}>
          {fileAssignments ? (
            <Form.Item
              name='kind'
              label={<FormattedMessage id='teacher_board.kind' />}
              tooltip={intl.formatMessage({ id: 'teacher_board.kind_why' })}>
              <Segmented
                options={[
                  {
                    value: 'scratch',
                    label: intl.formatMessage({ id: 'teacher_board.kind_scratch' }),
                  },
                  { value: 'file', label: intl.formatMessage({ id: 'teacher_board.kind_file' }) },
                ]}
              />
            </Form.Item>
          ) : null}
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
          {assignKind === 'file' ? (
            <FileAssignmentFields open={assignOpen} />
          ) : (
            <Form.Item
              name='templateProjectId'
              label={<FormattedMessage id='teacher_board.field_template' />}
              tooltip={intl.formatMessage({ id: 'teacher_board.template_why' })}
              extra={
                templates.length ? null : <FormattedMessage id='teacher_board.template_hint' />
              }>
              <Select
                allowClear
                showSearch
                optionFilterProp='label'
                options={templates.map(t => ({
                  value: t.projectPageId,
                  label: t.title || intl.formatMessage({ id: 'project_card.untitled' }),
                }))}
                placeholder={intl.formatMessage({ id: 'teacher_board.template_placeholder' })}
              />
            </Form.Item>
          )}
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
        {/* File work starts with the student's first file: there is nothing to issue. */}
        {activeAssignment && activeAssignment.kind !== 'file' ? (
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

      <CoTeachersModal
        open={coTeachersOpen}
        classId={classId}
        isCoTeacher={isCoTeacher}
        onClose={() => setCoTeachersOpen(false)}
        onLeft={() => navigate(TEACHER_CLASSES_ROUTE)}
      />

      <Modal
        open={!!reviewProject}
        title={reviewProject?.title || intl.formatMessage({ id: 'teacher_board.review' })}
        onCancel={closeReview}
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
        {reviewProject?.submissionNote ? (
          <div style={{ marginBottom: 16 }}>
            <SubmissionNote
              note={reviewProject.submissionNote}
              titleId='teacher_board.student_note'
            />
          </div>
        ) : null}
        {reviewProject?.submissionId ? (
          <div style={{ marginBottom: 16 }}>
            <Text strong>
              <FormattedMessage id='teacher_board.files_title' />
            </Text>
            <AssignmentFiles
              files={reviewProject.files}
              download={f => api.downloadSubmissionFile(reviewProject.submissionId, f.id, f.name)}
              emptyText={intl.formatMessage({ id: 'class_files.no_files' })}
            />
          </div>
        ) : null}
        {reviewProject?.projectId ? (
          <div style={{ marginBottom: 16 }}>
            <ScratchPlayerEmbed
              projectPageId={reviewProject.projectId}
              reloadKey={reviewRow?.editedAt || 0}
            />
            <Space wrap size={8} style={{ marginTop: 8 }}>
              <Button icon={<CodeOutlined />} onClick={openInScratch}>
                <FormattedMessage id='teacher_board.open_in_scratch' />
              </Button>
              {reviewRow?.canRestore ? (
                <Popconfirm
                  title={intl.formatMessage({ id: 'teacher_board.restore_confirm' })}
                  description={intl.formatMessage({ id: 'teacher_board.restore_hint' })}
                  okText={intl.formatMessage({ id: 'teacher_board.restore_work' })}
                  cancelText={intl.formatMessage({ id: 'common.cancel' })}
                  onConfirm={restoreWork}>
                  <Button icon={<UndoOutlined />}>
                    <FormattedMessage id='teacher_board.restore_work' />
                  </Button>
                </Popconfirm>
              ) : null}
              <Button
                type='link'
                href={PROJECT_PAGE_ROUTE.replace(':projectPageId', reviewProject.projectId)}
                target='_blank'>
                <FormattedMessage id='teacher_board.open_project' />
              </Button>
            </Space>
            <Paragraph type='secondary' style={{ margin: '8px 0 0' }}>
              <FormattedMessage
                id={reviewRow?.canEdit ? 'teacher_board.edit_hint' : 'teacher_board.view_only_hint'}
              />
            </Paragraph>
            <EditingNote editors={reviewRow?.editors} style={{ marginTop: 8 }} />
            <TeacherEditNote
              at={reviewRow?.editedAt}
              name={reviewRow?.editedByName}
              style={{ marginTop: 8 }}
            />
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
