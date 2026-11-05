import React, { useEffect, useId, useState } from 'react'
import { Input, Modal, Typography } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

const { Paragraph, Text } = Typography
const { TextArea } = Input

// As the backend's maxSubmissionNoteChars.
const MAX_NOTE_CHARS = 2000

/**
 * The optional text for the teacher: the last step of a hand-in, where confirmId says what
 * happens next, or a change to it later. The text survives a cancel; it starts from note, the
 * text the backend holds, so returned work opens with what the last hand-in said.
 */
const SubmissionNoteModal = ({
  open,
  titleId,
  confirmId,
  okId,
  note,
  loading,
  onCancel,
  onSubmit,
}) => {
  const intl = useIntl()
  const noteId = useId()
  const [text, setText] = useState(note || '')

  useEffect(() => setText(note || ''), [note])

  return (
    <Modal
      open={open}
      title={<FormattedMessage id={titleId} />}
      okText={<FormattedMessage id={okId} />}
      cancelText={<FormattedMessage id='common.cancel' />}
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => onSubmit(text)}>
      {confirmId ? (
        <Paragraph>
          <FormattedMessage id={confirmId} />
        </Paragraph>
      ) : null}
      <label htmlFor={noteId}>
        <Text strong>
          <FormattedMessage id='student_class.note_label' />
        </Text>
      </label>
      <TextArea
        id={noteId}
        rows={4}
        maxLength={MAX_NOTE_CHARS}
        showCount
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={intl.formatMessage({ id: 'student_class.note_placeholder' })}
        // The counter is positioned below the field and takes no room of its own.
        style={{ marginTop: 8, marginBottom: 24 }}
      />
    </Modal>
  )
}

export default SubmissionNoteModal
