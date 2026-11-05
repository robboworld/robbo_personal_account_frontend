import React, { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Empty,
  Input,
  List,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

import { AssignmentTags, TeacherComment, assignmentState } from './AssignmentStatus'
import FileAssignmentItem from './FileAssignmentItem'

import { PageContent, Panel, SectionHeader, SectionTitle } from '@/components/AccountShell'
import * as api from '@/api/teacherClass'
import { JOIN_CLASS_CODE_ROUTE, PROJECT_PAGE_ROUTE } from '@/constants'
import { apiErrorMessage, classCodeErrorMessage } from '@/helpers/apiErrorMessage'
import { openScratchEditor } from '@/utils/scratchEditor'

const { Paragraph, Text } = Typography

const AssignmentItem = ({ assignment, onSubmitted }) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const status = assignment.myReviewStatus || (assignment.myProjectId ? 'draft' : '')
  const { handedIn, closed } = assignmentState(assignment, status)

  const submit = async () => {
    setSubmitting(true)
    try {
      await api.submitProject(assignment.myProjectId)
      message.success(intl.formatMessage({ id: 'student_class.submitted' }))
      onSubmitted()
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'student_class.submit_error'))
    } finally {
      setSubmitting(false)
    }
  }

  // Handed-in work is read-only until the teacher returns it (backend HOMEWORK_LOCKED).
  const actions = assignment.myProjectId
    ? [
        !handedIn && (
          <Button key='edit' type='link' onClick={() => openScratchEditor(assignment.myProjectId)}>
            <FormattedMessage id='student_class.open_editor' />
          </Button>
        ),
        <Button
          key='page'
          type='link'
          onClick={() =>
            navigate(PROJECT_PAGE_ROUTE.replace(':projectPageId', assignment.myProjectId))
          }>
          <FormattedMessage id='student_class.open_page' />
        </Button>,
        <Popconfirm
          key='submit'
          title={intl.formatMessage({ id: 'student_class.submit_confirm' })}
          okText={intl.formatMessage({ id: 'student_class.submit' })}
          cancelText={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={submit}
          disabled={handedIn || closed}>
          <Button type='primary' size='small' loading={submitting} disabled={handedIn || closed}>
            <FormattedMessage
              id={status === 'returned' ? 'student_class.resubmit' : 'student_class.submit'}
            />
          </Button>
        </Popconfirm>,
      ].filter(Boolean)
    : []

  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        title={assignment.title}
        description={
          <Space orientation='vertical' size={4} style={{ width: '100%' }}>
            <AssignmentTags assignment={assignment} status={status} />
            {assignment.instructions ? <Text>{assignment.instructions}</Text> : null}
            {!assignment.myProjectId ? (
              <Text type='secondary'>
                <FormattedMessage id='student_class.not_issued_hint' />
              </Text>
            ) : null}
            <TeacherComment comment={assignment.myReviewComment} status={status} />
          </Space>
        }
      />
    </List.Item>
  )
}

const ClassCard = ({ klass, onLeft }) => {
  const intl = useIntl()
  const [assignments, setAssignments] = useState(null)
  const [leaving, setLeaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const { data } = await api.listStudentAssignments(klass.id)
      setAssignments(data.items || [])
    } catch (e) {
      setAssignments([])
      message.error(apiErrorMessage(e, intl, 'student_class.assignments_error'))
    }
  }, [klass.id, intl])

  useEffect(() => {
    load()
  }, [load])

  const leave = async () => {
    setLeaving(true)
    try {
      await api.leaveClass(klass.id)
      message.success(intl.formatMessage({ id: 'student_class.leave_success' }))
      onLeft()
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'student_class.leave_error'))
      setLeaving(false)
    }
  }

  return (
    <Card
      title={klass.displayName}
      extra={
        <Popconfirm
          title={intl.formatMessage(
            { id: 'student_class.leave_confirm' },
            { name: klass.displayName },
          )}
          description={intl.formatMessage({ id: 'student_class.leave_confirm_hint' })}
          okText={intl.formatMessage({ id: 'student_class.leave' })}
          okButtonProps={{ danger: true }}
          cancelText={intl.formatMessage({ id: 'common.cancel' })}
          onConfirm={leave}>
          <Button danger size='small' loading={leaving}>
            <FormattedMessage id='student_class.leave' />
          </Button>
        </Popconfirm>
      }>
      {klass.ownerName ? (
        <Paragraph type='secondary' style={{ marginBottom: 8 }}>
          <FormattedMessage id='student_class.teacher_label' values={{ name: klass.ownerName }} />
        </Paragraph>
      ) : null}
      {assignments === null ? (
        <Spin />
      ) : (
        <List
          itemLayout='vertical'
          header={
            <Text strong>
              <FormattedMessage id='student_class.assignments' />
            </Text>
          }
          dataSource={assignments}
          locale={{ emptyText: intl.formatMessage({ id: 'student_class.no_assignments' }) }}
          renderItem={a =>
            a.kind === 'file' ? (
              <FileAssignmentItem key={a.id} assignment={a} onChanged={load} />
            ) : (
              <AssignmentItem key={a.id} assignment={a} onSubmitted={load} />
            )
          }
        />
      )}
    </Card>
  )
}

const StudentClassesPage = () => {
  const navigate = useNavigate()
  const intl = useIntl()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.listStudentClasses()
      setItems(data.items || [])
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'student_class.load_error'))
    } finally {
      setLoading(false)
    }
  }, [intl])

  useEffect(() => {
    load()
  }, [load])

  const join = async () => {
    if (!code.trim()) return
    setJoining(true)
    try {
      await api.joinClass({ code: code.trim() })
      message.success(intl.formatMessage({ id: 'student_class.join_success' }))
      setCode('')
      load()
    } catch (e) {
      message.error(classCodeErrorMessage(e, intl, 'student_class.join_error'))
    } finally {
      setJoining(false)
    }
  }

  return (
    <PageContent $wide>
      <Panel>
        <SectionHeader>
          <SectionTitle>
            <FormattedMessage id='student_class.title' />
          </SectionTitle>
          <Button onClick={() => navigate(JOIN_CLASS_CODE_ROUTE)}>
            <FormattedMessage id='student_class.join_by_code' />
          </Button>
        </SectionHeader>
        <Space.Compact style={{ width: '100%', maxWidth: 420, marginBottom: 24 }}>
          <Input
            placeholder={intl.formatMessage({ id: 'student_class.code_placeholder' })}
            aria-label={intl.formatMessage({ id: 'student_class.code_placeholder' })}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            onPressEnter={join}
          />
          <Button type='primary' onClick={join} loading={joining} disabled={!code.trim()}>
            <FormattedMessage id='student_class.join_button' />
          </Button>
        </Space.Compact>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description={<FormattedMessage id='student_class.empty' />} />
        ) : (
          <Space orientation='vertical' size='large' style={{ width: '100%' }}>
            {items.map(item => (
              <ClassCard key={item.id} klass={item} onLeft={load} />
            ))}
          </Space>
        )}
      </Panel>
    </PageContent>
  )
}

export default StudentClassesPage
