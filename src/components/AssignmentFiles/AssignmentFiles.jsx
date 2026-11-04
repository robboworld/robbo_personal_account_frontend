import React, { useState } from 'react'
import { Button, List, Popconfirm, Space, Typography, message } from 'antd'
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'

import { FileNameCell } from '@/components/FileIcon'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatFileSize } from '@/helpers/tariffs'

const { Text } = Typography

/**
 * Download button of a class file. A file with Python scripts inside asks first, as in
 * "Мои файлы". download(file) fetches it; errors are shown here.
 */
export const FileDownloadButton = ({ file, download, children, type = 'text' }) => {
  const intl = useIntl()
  const [busy, setBusy] = useState(false)
  const run = async () => {
    setBusy(true)
    try {
      await download(file)
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setBusy(false)
    }
  }
  const label = intl.formatMessage({ id: 'my_files.download' })
  return (
    <Popconfirm
      disabled={!file.hasScripts}
      title={intl.formatMessage({ id: 'my_files.scripts_download_confirm' })}
      description={intl.formatMessage({ id: 'my_files.scripts_warning' })}
      okText={label}
      cancelText={intl.formatMessage({ id: 'common.cancel' })}
      onConfirm={run}>
      <Button
        type={type}
        icon={<DownloadOutlined />}
        aria-label={children ? undefined : label}
        title={children ? undefined : label}
        loading={busy}
        onClick={file.hasScripts ? undefined : run}>
        {children}
      </Button>
    </Popconfirm>
  )
}

/** Files of a submission: name, size, download, and remove when onRemove is given. */
const AssignmentFiles = ({ files, download, onRemove, removing, emptyText }) => {
  const intl = useIntl()
  if (!files?.length) {
    return emptyText ? <Text type='secondary'>{emptyText}</Text> : null
  }
  return (
    <List
      size='small'
      dataSource={files}
      rowKey='id'
      renderItem={file => (
        <List.Item
          actions={[
            download ? <FileDownloadButton key='dl' file={file} download={download} /> : null,
            onRemove ? (
              <Button
                key='rm'
                type='text'
                danger
                icon={<DeleteOutlined />}
                aria-label={intl.formatMessage({ id: 'class_files.remove' }, { name: file.name })}
                title={intl.formatMessage({ id: 'class_files.remove' }, { name: file.name })}
                loading={removing === file.id}
                disabled={!!removing}
                onClick={() => onRemove(file)}
              />
            ) : null,
          ].filter(Boolean)}>
          <Space size={8} style={{ minWidth: 0 }}>
            <FileNameCell name={file.name} hasScripts={file.hasScripts} />
            <Text type='secondary'>{formatFileSize(intl, file.sizeBytes)}</Text>
          </Space>
        </List.Item>
      )}
    />
  )
}

export default AssignmentFiles
