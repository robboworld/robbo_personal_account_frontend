import React, { useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { Form, Input, Modal, Upload, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { importProjectSb3 } from '@/api/projectPage'
import { getEntitlements } from '@/api/licensing'
import { isUploadCanceled } from '@/api/userFiles'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'

const MAX_TITLE_LENGTH = 200

const titleFromFileName = name =>
  name
    .replace(/\.sb3$/i, '')
    .trim()
    .slice(0, MAX_TITLE_LENGTH)

/** New project from an .sb3 picked in the LK: file + name, without opening Scratch. */
const ImportProjectModal = ({ open, onClose, onImported }) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [busy, setBusy] = useState(false)
  const controller = useRef(null)

  const reset = () => {
    form.resetFields()
    onClose()
  }

  // During the upload "Отмена" stops it; the dialog closes once the request has ended.
  const close = () => {
    if (busy) {
      controller.current?.abort()
    } else {
      reset()
    }
  }

  const pickFile = picked => {
    if (!picked.name.toLowerCase().endsWith('.sb3')) {
      message.error(intl.formatMessage({ id: 'project_page.upload_sb3_invalid' }))
      return Upload.LIST_IGNORE
    }
    if (!form.getFieldValue('title')?.trim()) {
      form.setFieldsValue({ title: titleFromFileName(picked.name) })
    }
    // Keep the file in the browser; it is sent on submit together with the name.
    return false
  }

  const submit = async ({ fileList, title }) => {
    const file = fileList[0].originFileObj
    controller.current = new AbortController()
    setBusy(true)
    try {
      // Reject oversized files before sending: the server cuts the body off mid-upload,
      // and browsers then often report a network error instead of the size error.
      const entitlements = await getEntitlements().catch(() => null)
      const maxMb = Number(entitlements?.maxProjectSizeMb) || 0
      if (maxMb > 0 && file.size > maxMb * 1024 * 1024) {
        message.error(
          intl.formatMessage({ id: 'project_page.upload_sb3_too_large' }, { mb: maxMb }),
        )
        return
      }
      const created = await importProjectSb3(file, title.trim(), controller.current.signal)
      form.resetFields()
      onImported(created)
    } catch (e) {
      if (isUploadCanceled(e)) {
        message.info(intl.formatMessage({ id: 'my_files.upload_canceled' }, { name: file.name }))
        reset()
      } else if (e?.message === 'INVALID_PROJECT_FILE') {
        message.error(intl.formatMessage({ id: 'project_page.invalid_project_file' }))
      } else {
        message.error(apiErrorMessage(e, intl, 'my_projects.import_error'))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      title={<FormattedMessage id='my_projects.import_title' />}
      onCancel={close}
      onOk={() => form.submit()}
      okText={<FormattedMessage id='my_projects.import_submit' />}
      cancelText={<FormattedMessage id='common.cancel' />}
      // Not confirmLoading: antd then ignores "Отмена", and it has to stop the upload.
      okButtonProps={{ loading: busy }}
      maskClosable={!busy}>
      <Form form={form} layout='vertical' onFinish={submit} disabled={busy}>
        <Form.Item
          name='fileList'
          valuePropName='fileList'
          getValueFromEvent={e => e?.fileList}
          rules={[
            {
              required: true,
              type: 'array',
              message: intl.formatMessage({ id: 'my_projects.import_file_required' }),
            },
          ]}>
          <Upload.Dragger
            accept='.sb3,application/x.scratch.sb3'
            multiple={false}
            maxCount={1}
            beforeUpload={pickFile}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
              <FormattedMessage id='my_projects.import_file_hint' />
            </p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name='title'
          label={<FormattedMessage id='my_projects.import_name' />}
          rules={[
            {
              required: true,
              whitespace: true,
              message: intl.formatMessage({ id: 'my_projects.import_name_required' }),
            },
          ]}>
          <Input maxLength={MAX_TITLE_LENGTH} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ImportProjectModal
