import React from 'react'
import { Form, Input, Modal } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { FileExtension, RenameHint } from './styles'

import { splitFileName } from '@/api/userFiles'

// user_files_name_len: the whole name, extension included.
const MAX_NAME_LENGTH = 255

/** Edits the name before the extension: the backend refuses a new extension. */
const RenameFileModal = ({ file, saving, onCancel, onSubmit }) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const { stem, ext } = splitFileName(file.name)
  const invalid = intl.formatMessage({ id: 'my_files.rename_invalid' })

  return (
    <Modal
      open
      title={<FormattedMessage id='my_files.rename' />}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={<FormattedMessage id='common.save' />}
      cancelText={<FormattedMessage id='common.cancel' />}
      confirmLoading={saving}>
      <Form
        form={form}
        layout='vertical'
        initialValues={{ stem }}
        onFinish={values => onSubmit(file, `${values.stem.trim()}${ext}`)}>
        <Form.Item
          name='stem'
          label={<FormattedMessage id='my_files.rename_label' />}
          extra={
            <RenameHint>
              <FormattedMessage id='my_files.rename_hint' />
            </RenameHint>
          }
          rules={[
            { required: true, whitespace: true, message: invalid },
            { pattern: /^[^/\\]*$/, message: invalid },
          ]}>
          <Input
            autoFocus
            suffix={<FileExtension>{ext}</FileExtension>}
            maxLength={MAX_NAME_LENGTH - ext.length}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RenameFileModal
