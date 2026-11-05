import React from 'react'
import { Alert, Space, Tag, Typography } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'dayjs'

import { formatDateTime } from '@/helpers/formatDateTime'
import {
  CLOSED_TAG_PROPS,
  REVIEW_STATUS_COLOR,
  isHandedIn,
  reviewStatusLabel,
} from '@/pages/TeacherClassBoard/reviewStatus'

const { Paragraph, Text } = Typography

/** Where the student's work on an assignment stands: handed in, closed, overdue. */
export const assignmentState = (assignment, status) => {
  const handedIn = isHandedIn(status) && status !== 'returned'
  return {
    handedIn,
    closed: !!assignment.closedAt,
    overdue: !!assignment.dueAt && !handedIn && dayjs(assignment.dueAt).isBefore(dayjs()),
  }
}

/** Status, closed and overdue tags with the due date. */
export const AssignmentTags = ({ assignment, status }) => {
  const intl = useIntl()
  const { handedIn, closed, overdue } = assignmentState(assignment, status)
  return (
    <Space wrap size={6}>
      {status ? (
        <Tag color={REVIEW_STATUS_COLOR[status]}>{reviewStatusLabel(intl, status)}</Tag>
      ) : (
        <Tag>
          <FormattedMessage id='student_class.not_issued' />
        </Tag>
      )}
      {closed && !handedIn ? (
        <Tag {...CLOSED_TAG_PROPS}>
          <FormattedMessage id='student_class.closed' />
        </Tag>
      ) : null}
      {overdue ? (
        <Tag color='error'>
          <FormattedMessage id='student_class.overdue' />
        </Tag>
      ) : null}
      {assignment.dueAt ? (
        <Text type='secondary'>
          <FormattedMessage
            id='teacher_board.due'
            values={{ when: formatDateTime(assignment.dueAt, intl.locale) }}
          />
        </Text>
      ) : null}
    </Space>
  )
}

/** The student's text from the last hand-in, line breaks included. Plain text, never markup. */
export const SubmissionNote = ({ note, titleId }) => {
  if (!note) return null
  return (
    <div>
      <Text strong>
        <FormattedMessage id={titleId} />
      </Text>
      <Paragraph style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginBottom: 0 }}>
        {note}
      </Paragraph>
    </div>
  )
}

const editorLabelId = editor => {
  if (editor.role === 'student') return 'work_editing.student'
  return editor.name ? 'work_editing.teacher' : 'work_editing.teacher_anon'
}

/** What a person editing the work is shown as; the name may be unknown to the LMS. */
export const editorLabel = (intl, editor) =>
  intl.formatMessage({ id: editorLabelId(editor) }, { name: editor.name })

/** Who has the work open in the editor right now. */
export const EditingNote = ({ editors, style }) => {
  const intl = useIntl()
  if (!editors?.length) return null
  return (
    <Alert
      type='warning'
      showIcon
      style={style}
      title={editors.map(editor => editorLabel(intl, editor)).join('; ')}
    />
  )
}

/** A teacher changed the blocks of this work and when; the name may be unknown to the LMS. */
export const TeacherEditNote = ({ at, name, style }) => {
  const intl = useIntl()
  if (!at) return null
  const when = formatDateTime(at, intl.locale)
  return (
    <Alert
      type='info'
      showIcon
      style={style}
      title={intl.formatMessage(
        { id: name ? 'teacher_edit.note' : 'teacher_edit.note_anon' },
        { name, when },
      )}
    />
  )
}

/** The teacher's comment; a warning when the work came back for rework. */
export const TeacherComment = ({ comment, status }) => {
  const intl = useIntl()
  if (!comment) return null
  return (
    <Alert
      type={status === 'returned' ? 'warning' : 'info'}
      showIcon
      title={intl.formatMessage({ id: 'student_class.teacher_comment' })}
      description={comment}
    />
  )
}
