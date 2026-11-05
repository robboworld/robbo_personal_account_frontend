import React, { useState } from 'react'
import { Button, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import { SubmissionNote } from './AssignmentStatus'
import SubmissionNoteModal from './SubmissionNoteModal'

import { apiErrorMessage } from '@/helpers/apiErrorMessage'

/**
 * The student's text from the last hand-in. While the work waits for review (editable) it can
 * be changed, added or removed without handing the work in again.
 */
const EditableSubmissionNote = ({ note, editable, save, onSaved }) => {
  const intl = useIntl()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const submit = async text => {
    setSaving(true)
    try {
      await save(text)
      message.success(intl.formatMessage({ id: 'student_class.note_saved' }))
      setEditing(false)
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'student_class.note_save_error'))
    } finally {
      setSaving(false)
      // After a refusal too: the teacher may have reviewed the work in the meantime.
      onSaved()
    }
  }

  if (!editable) return <SubmissionNote note={note} titleId='student_class.my_note' />
  return (
    <div>
      <SubmissionNote note={note} titleId='student_class.my_note' />
      <Button
        type='link'
        size='small'
        icon={<EditOutlined />}
        style={{ paddingInline: 0 }}
        onClick={() => setEditing(true)}>
        <FormattedMessage id={note ? 'student_class.note_edit' : 'student_class.note_add'} />
      </Button>
      <SubmissionNoteModal
        open={editing}
        titleId='student_class.note_edit_title'
        okId='common.save'
        note={note}
        loading={saving}
        onCancel={() => setEditing(false)}
        onSubmit={submit}
      />
    </div>
  )
}

export default EditableSubmissionNote
