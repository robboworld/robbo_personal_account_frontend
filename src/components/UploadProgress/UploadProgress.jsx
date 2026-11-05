import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Progress, Typography } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import Flex from '@/components/Flex'

const { Text } = Typography

/** One file on its way up: percent null while it waits in the queue, no onCancel at the end. */
const UploadProgress = ({ name, percent, size, onCancel }) => {
  const intl = useIntl()
  const queued = percent === null
  const label = intl.formatMessage({ id: 'my_files.upload_cancel' }, { name })
  return (
    <div>
      <Flex align='center' justify='space-between' style={{ gap: 8 }}>
        <Text type='secondary' ellipsis style={{ minWidth: 0 }}>
          <FormattedMessage
            id={queued ? 'my_files.upload_queued' : 'my_files.uploading'}
            values={{ name }}
          />
        </Text>
        {onCancel ? (
          <Button
            size='small'
            type='text'
            icon={<CloseOutlined />}
            aria-label={label}
            title={label}
            onClick={onCancel}>
            <FormattedMessage id='common.cancel' />
          </Button>
        ) : null}
      </Flex>
      {queued ? null : <Progress percent={percent} size={size} status='active' />}
    </div>
  )
}

export default UploadProgress
