import React from 'react'
import { Tooltip, theme } from 'antd'
import { useIntl } from 'react-intl'
import {
  AudioOutlined,
  BlockOutlined,
  CodeOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileZipOutlined,
  WarningOutlined,
} from '@ant-design/icons'

import { FileName } from './styles'

const ICON_BY_EXTENSION = {
  png: FileImageOutlined,
  jpg: FileImageOutlined,
  jpeg: FileImageOutlined,
  webp: FileImageOutlined,
  gif: FileImageOutlined,
  pdf: FilePdfOutlined,
  docx: FileWordOutlined,
  odt: FileWordOutlined,
  xlsx: FileExcelOutlined,
  pptx: FilePptOutlined,
  txt: FileTextOutlined,
  sb3: CodeOutlined,
  sb2: CodeOutlined,
  sb: CodeOutlined,
  ino: CodeOutlined,
  stl: BlockOutlined,
  fcstd: BlockOutlined,
  skp: BlockOutlined,
  mp3: AudioOutlined,
  wav: AudioOutlined,
  ogg: AudioOutlined,
  zip: FileZipOutlined,
}

/** Icon by file extension, for the allow-listed types of "My files". */
const FileIcon = ({ name }) => {
  const ext = String(name || '')
    .split('.')
    .pop()
    .toLowerCase()
  const Icon = ICON_BY_EXTENSION[ext] || FileOutlined
  return <Icon aria-hidden />
}

/** Icon + name that ellipsizes in a table cell; hasScripts adds a warning mark. */
export const FileNameCell = ({ name, hasScripts = false }) => {
  const intl = useIntl()
  const { token } = theme.useToken()
  return (
    <FileName title={name}>
      <FileIcon name={name} />
      {hasScripts ? (
        <Tooltip title={intl.formatMessage({ id: 'my_files.scripts_warning' })}>
          <WarningOutlined
            role='img'
            aria-label={intl.formatMessage({ id: 'my_files.scripts_mark' })}
            style={{ color: token.colorWarning }}
          />
        </Tooltip>
      ) : null}
      <span>{name}</span>
    </FileName>
  )
}

export default FileIcon
