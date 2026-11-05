import React, { useRef, useState } from 'react'
import { Button, List, Modal, Popconfirm, Select, Space, Typography, Upload, message } from 'antd'
import { FolderOpenOutlined, InboxOutlined } from '@ant-design/icons'
import { FormattedMessage, useIntl } from 'react-intl'

import { AssignmentTags, TeacherComment, assignmentState } from './AssignmentStatus'

import * as api from '@/api/teacherClass'
import {
  acceptForKinds,
  downloadFile,
  isUploadCanceled,
  kindOfFileName,
  kindsLabel,
  listFiles,
  uploadFile,
} from '@/api/userFiles'
import { getEntitlements } from '@/api/licensing'
import AssignmentFiles, { FileDownloadButton } from '@/components/AssignmentFiles'
import { FileNameCell } from '@/components/FileIcon'
import UploadProgress from '@/components/UploadProgress'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { precheckUpload, uploadProblemMessage } from '@/pages/MyFiles/fileChecks'

const { Text } = Typography

/**
 * A file assignment: the student uploads files (or picks them from "Мои файлы"), and hands
 * them in. Each file stays in "Мои файлы" and in the student's quota.
 */
const FileAssignmentItem = ({ assignment, onChanged }) => {
  const intl = useIntl()
  const status = assignment.myReviewStatus || ''
  const { handedIn, closed } = assignmentState(assignment, status)
  const editable = !closed && !handedIn
  const files = assignment.myFiles || []
  const kinds = assignment.allowedKinds || []
  const maxFiles = assignment.maxFiles || 10
  const [uploads, setUploads] = useState([]) // the file being sent, then the queue
  const [removing, setRemoving] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [picker, setPicker] = useState(null) // library files while the picker is open
  const [picked, setPicked] = useState([])
  // The backend takes two uploads per account at a time: several dropped files go one by one.
  const queue = useRef(Promise.resolve())
  const pending = useRef(new Set())

  const fail = e => message.error(apiErrorMessage(e, intl))
  const typesText = kinds.length
    ? kindsLabel(kinds)
    : intl.formatMessage({ id: 'class_files.any_types' })

  const kindAllowed = kind => !kinds.length || kinds.includes(kind)

  const beforeUpload = async file => {
    if (!kindAllowed(kindOfFileName(file.name))) {
      message.error(
        intl.formatMessage(
          { id: 'class_files.kind_not_allowed' },
          { name: file.name, types: typesText },
        ),
      )
      return Upload.LIST_IGNORE
    }
    if (files.length + pending.current.size >= maxFiles) {
      message.error(intl.formatMessage({ id: 'class_files.too_many' }, { max: maxFiles }))
      return Upload.LIST_IGNORE
    }
    let ent = null
    try {
      ent = await getEntitlements()
    } catch (_) {
      /* the backend checks the limits again */
    }
    const problem = precheckUpload(file, ent)
    if (problem) {
      message.error(uploadProblemMessage(intl, file, problem))
      return Upload.LIST_IGNORE
    }
    pending.current.add(file.uid)
    return true
  }

  const attach = async row => {
    await api.attachAssignmentFile(assignment.id, row.id)
    if (row.hasScripts) {
      message.warning(intl.formatMessage({ id: 'my_files.scripts_uploaded' }, { name: row.name }))
    }
    message.success(intl.formatMessage({ id: 'class_files.attached' }, { name: row.name }))
  }

  const upload = file => {
    const { uid, name } = file
    const controller = new AbortController()
    const patch = fields =>
      setUploads(all => all.map(u => (u.uid === uid ? { ...u, ...fields } : u)))
    const forget = () => {
      pending.current.delete(uid)
      setUploads(all => all.filter(u => u.uid !== uid))
    }
    const cancel = () => {
      controller.abort()
      forget()
      message.info(intl.formatMessage({ id: 'my_files.upload_canceled' }, { name }))
    }
    setUploads(all => [...all, { uid, name, percent: null, cancel }])
    queue.current = queue.current.then(async () => {
      if (controller.signal.aborted) return
      patch({ percent: 0 })
      try {
        const row = await uploadFile(file, percent => patch({ percent }), controller.signal)
        // On the server now: cancelling would not take the file back.
        patch({ cancel: null })
        if (row) await attach(row)
      } catch (e) {
        if (!isUploadCanceled(e)) fail(e)
      } finally {
        forget()
        onChanged()
      }
    })
  }

  const openPicker = async () => {
    setPicked([])
    try {
      const all = await listFiles()
      const attached = new Set(files.map(f => f.id))
      setPicker(all.filter(f => !attached.has(f.id) && kindAllowed(f.kind)))
    } catch (e) {
      fail(e)
    }
  }

  const attachPicked = async () => {
    const chosen = (picker || []).filter(f => picked.includes(f.id))
    setPicker(null)
    for (const row of chosen) {
      try {
        await attach(row)
      } catch (e) {
        fail(e)
        break
      }
    }
    onChanged()
  }

  const remove = async file => {
    setRemoving(file.id)
    try {
      await api.detachAssignmentFile(assignment.id, file.id)
      onChanged()
    } catch (e) {
      fail(e)
    } finally {
      setRemoving(null)
    }
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      await api.submitAssignmentFiles(assignment.id)
      message.success(intl.formatMessage({ id: 'student_class.submitted' }))
      onChanged()
    } catch (e) {
      message.error(apiErrorMessage(e, intl, 'student_class.submit_error'))
    } finally {
      setSubmitting(false)
    }
  }

  const actions = [
    assignment.templateFile ? (
      <FileDownloadButton
        key='starter'
        type='link'
        file={assignment.templateFile}
        download={f => api.downloadStarterFile(assignment.id, f.name)}>
        <FormattedMessage id='class_files.starter' />
      </FileDownloadButton>
    ) : null,
    <Popconfirm
      key='submit'
      title={intl.formatMessage({ id: 'class_files.submit_confirm' })}
      okText={intl.formatMessage({ id: 'student_class.submit' })}
      cancelText={intl.formatMessage({ id: 'common.cancel' })}
      onConfirm={submit}
      disabled={!editable || !files.length}>
      <Button
        type='primary'
        size='small'
        loading={submitting}
        disabled={!editable || !files.length || uploads.length > 0}>
        <FormattedMessage
          id={status === 'returned' ? 'student_class.resubmit' : 'student_class.submit'}
        />
      </Button>
    </Popconfirm>,
  ].filter(Boolean)

  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        title={assignment.title}
        description={
          <Space orientation='vertical' size={8} style={{ width: '100%' }}>
            <AssignmentTags assignment={assignment} status={status || 'missing'} />
            {assignment.instructions ? <Text>{assignment.instructions}</Text> : null}
            <Text type='secondary'>
              <FormattedMessage
                id='class_files.accepts'
                values={{ types: typesText, max: maxFiles }}
              />
            </Text>
            <TeacherComment comment={assignment.myReviewComment} status={status} />
            <div>
              <Text strong>
                <FormattedMessage id='class_files.my_work' />
              </Text>
              <AssignmentFiles
                files={files}
                download={f => downloadFile(f.id, f.name)}
                onRemove={editable ? remove : undefined}
                removing={removing}
                emptyText={intl.formatMessage({ id: 'class_files.no_files' })}
              />
            </div>
            {editable ? (
              <React.Fragment>
                <Upload.Dragger
                  accept={acceptForKinds(kinds)}
                  multiple
                  showUploadList={false}
                  disabled={files.length >= maxFiles}
                  beforeUpload={beforeUpload}
                  customRequest={({ file }) => upload(file)}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                    <FormattedMessage id='class_files.upload_title' />
                  </p>
                  <p className='ant-upload-hint'>
                    <FormattedMessage id='class_files.upload_hint' />
                  </p>
                </Upload.Dragger>
                {uploads.map(u => (
                  <UploadProgress
                    key={u.uid}
                    name={u.name}
                    percent={u.percent}
                    size='small'
                    onCancel={u.cancel}
                  />
                ))}
                <Button
                  icon={<FolderOpenOutlined />}
                  onClick={openPicker}
                  disabled={files.length >= maxFiles}>
                  <FormattedMessage id='class_files.pick' />
                </Button>
              </React.Fragment>
            ) : null}
          </Space>
        }
      />
      <Modal
        open={!!picker}
        title={<FormattedMessage id='class_files.pick' />}
        onCancel={() => setPicker(null)}
        onOk={attachPicked}
        okText={<FormattedMessage id='class_files.attach' />}
        okButtonProps={{ disabled: !picked.length }}
        cancelText={<FormattedMessage id='common.cancel' />}>
        {picker?.length ? (
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            value={picked}
            onChange={ids => setPicked(ids.slice(0, Math.max(0, maxFiles - files.length)))}
            optionFilterProp='name'
            placeholder={intl.formatMessage({ id: 'class_files.pick_placeholder' })}
            aria-label={intl.formatMessage({ id: 'class_files.pick_placeholder' })}
            options={picker.map(f => ({
              value: f.id,
              name: f.name,
              label: <FileNameCell name={f.name} hasScripts={f.hasScripts} />,
            }))}
          />
        ) : (
          <Text type='secondary'>
            <FormattedMessage id='class_files.pick_empty' />
          </Text>
        )}
      </Modal>
    </List.Item>
  )
}

export default FileAssignmentItem
