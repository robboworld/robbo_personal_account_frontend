import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { EXTENSIONS_BY_KIND, FILE_KIND_GROUPS, listFiles } from '@/api/userFiles'
import { FileNameCell } from '@/components/FileIcon'

/**
 * Fields of a file assignment in the create form: the file types students may hand in and
 * the teacher's optional starter file from "Мои файлы". open reloads the files.
 */
const FileAssignmentFields = ({ open }) => {
  const intl = useIntl()
  const [files, setFiles] = useState(null)

  useEffect(() => {
    if (!open) return
    listFiles()
      .then(setFiles)
      .catch(() => setFiles([]))
  }, [open])

  const kindOptions = FILE_KIND_GROUPS.map(g => ({
    label: intl.formatMessage({ id: `class_files.group_${g.key}` }),
    options: g.kinds.map(k => ({ value: k, label: EXTENSIONS_BY_KIND[k].join(', ') })),
  }))

  return (
    <React.Fragment>
      <Form.Item
        name='allowedKinds'
        label={<FormattedMessage id='teacher_board.allowed_kinds' />}
        tooltip={intl.formatMessage({ id: 'teacher_board.allowed_kinds_why' })}>
        <Select
          mode='multiple'
          allowClear
          options={kindOptions}
          optionFilterProp='label'
          placeholder={intl.formatMessage({ id: 'class_files.any_types' })}
        />
      </Form.Item>
      <Form.Item
        name='templateFileId'
        label={<FormattedMessage id='teacher_board.starter_file' />}
        tooltip={intl.formatMessage({ id: 'teacher_board.starter_file_why' })}
        extra={
          files && !files.length ? <FormattedMessage id='teacher_board.starter_file_hint' /> : null
        }>
        <Select
          allowClear
          showSearch
          loading={files === null}
          optionFilterProp='name'
          placeholder={intl.formatMessage({ id: 'teacher_board.starter_file_placeholder' })}
          options={(files || []).map(f => ({
            value: f.id,
            name: f.name,
            label: <FileNameCell name={f.name} hasScripts={f.hasScripts} />,
          }))}
        />
      </Form.Item>
    </React.Fragment>
  )
}

export default FileAssignmentFields
