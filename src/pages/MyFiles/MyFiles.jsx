import React, { useMemo } from 'react'
import { DeleteOutlined, DownloadOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Empty, Popconfirm, Space, Table, Upload } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import RenameFileModal from './RenameFileModal'
import { maxFileSizeMb } from './fileChecks'
import { UploadArea } from './styles'

import { ALLOWED_FILE_ACCEPT } from '@/api/userFiles'
import StorageMeter from '@/components/StorageMeter'
import UploadProgress from '@/components/UploadProgress'
import { FileNameCell } from '@/components/FileIcon'
import { CatalogCount } from '@/components/ProjectCatalog/styles'
import {
  GlassPanel,
  HeroInner,
  HeroLead,
  HeroPanel,
  HeroTitle,
  PageContent,
  SectionHeader,
  SectionTitle,
  Stagger,
  staggerContainer,
  staggerItem,
} from '@/components/AccountShell'
import { formatDateTime } from '@/helpers/formatDateTime'
import { DEFAULT_TARIFFS, formatFileSize, formatStorageMb } from '@/helpers/tariffs'

const MyFiles = ({
  files,
  loading,
  unavailable,
  entitlements,
  upload,
  busyId,
  beforeUpload,
  onUpload,
  onDownload,
  renaming,
  onRenameOpen,
  onRenameCancel,
  onRename,
  onDelete,
}) => {
  const intl = useIntl()
  const limitMb = maxFileSizeMb(entitlements)

  const columns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'my_files.col_name' }),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (name, file) => <FileNameCell name={name} hasScripts={file.hasScripts} />,
      },
      {
        title: intl.formatMessage({ id: 'my_files.col_size' }),
        dataIndex: 'sizeBytes',
        key: 'size',
        width: 110,
        responsive: ['sm'],
        render: size => formatFileSize(intl, size),
      },
      {
        title: intl.formatMessage({ id: 'my_files.col_date' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 170,
        responsive: ['md'],
        render: createdAt => formatDateTime(createdAt, intl.locale),
      },
      {
        key: 'actions',
        width: 136,
        align: 'right',
        render: (_, file) => (
          <Space size={4}>
            {/* Python scripts inside: ask first; other files download on click. */}
            <Popconfirm
              disabled={!file.hasScripts}
              title={intl.formatMessage({ id: 'my_files.scripts_download_confirm' })}
              description={intl.formatMessage({ id: 'my_files.scripts_warning' })}
              okText={intl.formatMessage({ id: 'my_files.download' })}
              cancelText={intl.formatMessage({ id: 'modal_window.delete_confirm_cancel_text' })}
              onConfirm={() => onDownload(file)}>
              <Button
                type='text'
                icon={<DownloadOutlined />}
                aria-label={intl.formatMessage({ id: 'my_files.download' })}
                title={intl.formatMessage({ id: 'my_files.download' })}
                loading={busyId === file.id}
                disabled={!!busyId && busyId !== file.id}
                onClick={file.hasScripts ? undefined : () => onDownload(file)}
              />
            </Popconfirm>
            <Button
              type='text'
              icon={<EditOutlined />}
              aria-label={intl.formatMessage({ id: 'my_files.rename' })}
              title={intl.formatMessage({ id: 'my_files.rename' })}
              disabled={!!busyId}
              onClick={() => onRenameOpen(file)}
            />
            <Popconfirm
              title={intl.formatMessage({ id: 'my_files.delete_confirm' }, { name: file.name })}
              okText={intl.formatMessage({ id: 'modal_window.delete_confirm_ok' })}
              okType='danger'
              cancelText={intl.formatMessage({ id: 'modal_window.delete_confirm_cancel_text' })}
              onConfirm={() => onDelete(file)}>
              <Button
                type='text'
                danger
                icon={<DeleteOutlined />}
                aria-label={intl.formatMessage({ id: 'my_files.delete' })}
                title={intl.formatMessage({ id: 'my_files.delete' })}
                disabled={!!busyId}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [busyId, intl, onDelete, onDownload, onRenameOpen],
  )

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden' animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='my_files.title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='my_files.lead' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        {unavailable ? (
          <motion.div variants={staggerItem}>
            <GlassPanel>
              <Empty description={intl.formatMessage({ id: 'my_files.unavailable' })} />
            </GlassPanel>
          </motion.div>
        ) : (
          <React.Fragment>
            <motion.div variants={staggerItem}>
              <GlassPanel>
                <UploadArea>
                  {entitlements ? (
                    <StorageMeter
                      entitlements={entitlements}
                      showBreakdown
                      fullMessageId='my_files.storage_full'
                    />
                  ) : null}
                  <Upload.Dragger
                    accept={ALLOWED_FILE_ACCEPT}
                    multiple={false}
                    showUploadList={false}
                    disabled={!!upload}
                    beforeUpload={file => beforeUpload(file) || Upload.LIST_IGNORE}
                    customRequest={({ file }) => onUpload(file)}>
                    <p className='ant-upload-drag-icon'>
                      <InboxOutlined />
                    </p>
                    <p className='ant-upload-text'>
                      <FormattedMessage id='my_files.upload_title' />
                    </p>
                    <p className='ant-upload-hint'>
                      <FormattedMessage
                        id='my_files.upload_hint'
                        values={{
                          size: formatStorageMb(
                            intl,
                            limitMb || DEFAULT_TARIFFS.free.maxProjectSizeMb,
                          ),
                        }}
                      />
                    </p>
                  </Upload.Dragger>
                  {upload ? (
                    <UploadProgress
                      name={upload.name}
                      percent={upload.percent}
                      onCancel={upload.cancel}
                    />
                  ) : null}
                </UploadArea>
              </GlassPanel>
            </motion.div>

            <motion.div variants={staggerItem}>
              <GlassPanel>
                <SectionHeader>
                  <SectionTitle>
                    <FormattedMessage id='my_files.list_title' />
                  </SectionTitle>
                  {!loading && files.length > 0 ? (
                    <CatalogCount>
                      {intl.formatMessage({ id: 'my_files.count' }, { count: files.length })}
                    </CatalogCount>
                  ) : null}
                </SectionHeader>
                <Table
                  rowKey='id'
                  size='middle'
                  columns={columns}
                  dataSource={files}
                  loading={loading}
                  pagination={files.length > 20 ? { pageSize: 20, showSizeChanger: false } : false}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={intl.formatMessage({ id: 'my_files.empty' })}
                      />
                    ),
                  }}
                />
              </GlassPanel>
            </motion.div>
          </React.Fragment>
        )}
      </Stagger>
      {renaming ? (
        <RenameFileModal
          file={renaming}
          saving={busyId === renaming.id}
          onCancel={onRenameCancel}
          onSubmit={onRename}
        />
      ) : null}
    </PageContent>
  )
}

export default MyFiles
