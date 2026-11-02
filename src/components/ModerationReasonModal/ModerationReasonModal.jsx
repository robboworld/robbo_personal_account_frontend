import React, { useEffect, useState } from 'react'
import { Alert, Input, Modal, message } from 'antd'
import { useIntl } from 'react-intl'

export const MIN_REASON_LENGTH = 3

const { TextArea } = Input

/**
 * Super-admin action on someone else's content: the reason is required (≥3 chars) and goes
 * to the owner and the audit log. onSubmit gets the trimmed reason; the caller closes.
 */
const ModerationReasonModal = ({
  open,
  title,
  body,
  warning = null,
  okText,
  placeholder,
  danger = false,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const intl = useIntl()
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  const trimmed = reason.trim()

  const submit = () => {
    if (trimmed.length < MIN_REASON_LENGTH) {
      message.warning(intl.formatMessage({ id: 'project_page.moderate_reason_required' }))
      return
    }
    onSubmit(trimmed)
  }

  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      cancelText={intl.formatMessage({ id: 'project_page.moderate_cancel' })}
      okButtonProps={{
        danger,
        loading,
        disabled: trimmed.length < MIN_REASON_LENGTH,
      }}
      onOk={submit}
      onCancel={() => !loading && onCancel()}
      destroyOnHidden>
      {warning ? (
        <Alert type='warning' showIcon title={warning} style={{ marginBottom: 12 }} />
      ) : null}
      {body ? <p>{body}</p> : null}
      <TextArea
        rows={4}
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder={
          placeholder || intl.formatMessage({ id: 'project_page.moderate_reason_placeholder' })
        }
      />
    </Modal>
  )
}

export default ModerationReasonModal
