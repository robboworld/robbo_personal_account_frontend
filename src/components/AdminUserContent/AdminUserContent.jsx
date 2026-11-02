import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Space, Table, Tabs, Tag, Typography, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { ContentStack, ObjectCell } from './styles'

import {
  deleteUserFile,
  deleteUserProject,
  downloadUserFile,
  downloadUserProject,
  getUserAudit,
  getUserContent,
} from '@/api/adminContent'
import { FileNameCell } from '@/components/FileIcon'
import ModerationReasonModal from '@/components/ModerationReasonModal'
import StorageMeter from '@/components/StorageMeter'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatDateTime } from '@/helpers/formatDateTime'
import { displayProjectTitle } from '@/helpers/intl'
import { formatFileSize } from '@/helpers/tariffs'

const { Text } = Typography

const AUDIT_LIMIT = 50

export const AUDIT_ACTION_MESSAGE_IDS = {
  project_download: 'user_content.action_project_download',
  project_delete: 'user_content.action_project_delete',
  file_download: 'user_content.action_file_download',
  file_delete: 'user_content.action_file_delete',
}

const DELETE_ACTIONS = new Set(['project_delete', 'file_delete'])

// Modal texts per pending action: { kind: 'project' | 'file', op: 'download' | 'delete' }.
const MODAL_IDS = {
  'project.download': {
    title: 'user_content.download_project_title',
    body: 'user_content.download_body',
    ok: 'user_content.download',
    placeholder: 'user_content.download_reason_placeholder',
  },
  'file.download': {
    title: 'user_content.download_file_title',
    body: 'user_content.download_body',
    ok: 'user_content.download',
    placeholder: 'user_content.download_reason_placeholder',
  },
  'project.delete': {
    title: 'user_content.delete_project_title',
    body: 'user_content.delete_body',
    ok: 'user_content.delete',
    placeholder: 'project_page.moderate_reason_placeholder',
  },
  'file.delete': {
    title: 'user_content.delete_file_title',
    body: 'user_content.delete_body',
    ok: 'user_content.delete',
    placeholder: 'project_page.moderate_reason_placeholder',
  },
}

const pagination = rows => (rows.length > 10 ? { pageSize: 10, showSizeChanger: false } : false)

const emptyText = description => ({
  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />,
})

/**
 * Super admin: one user's projects, files and the moderation log, with download and delete.
 * Both actions ask for a reason; the backend logs it and notifies the owner on delete.
 * onDeleted fires after a successful delete, for callers that show sizes.
 */
const AdminUserContent = ({ userId, onDeleted }) => {
  const intl = useIntl()
  const [content, setContent] = useState(null)
  const [audit, setAudit] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [pending, setPending] = useState(null)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('projects')
  const reqRef = useRef(0)

  const load = useCallback(async () => {
    const reqId = ++reqRef.current
    setLoading(true)
    setLoadError(null)
    try {
      const [nextContent, nextAudit] = await Promise.all([
        getUserContent(userId),
        getUserAudit(userId, AUDIT_LIMIT),
      ])
      if (reqId === reqRef.current) {
        setContent(nextContent)
        setAudit(nextAudit)
      }
    } catch (e) {
      if (reqId === reqRef.current) {
        setLoadError(apiErrorMessage(e, intl, 'user_content.load_error'))
      }
    } finally {
      if (reqId === reqRef.current) {
        setLoading(false)
      }
    }
  }, [intl, userId])

  const reloadAudit = useCallback(async () => {
    try {
      setAudit(await getUserAudit(userId, AUDIT_LIMIT))
    } catch (_) {
      /* the action itself succeeded; the log refreshes on the next open */
    }
  }, [userId])

  useEffect(() => {
    setContent(null)
    setAudit([])
    setTab('projects')
    load()
  }, [load])

  const objectName = pending
    ? pending.kind === 'project'
      ? displayProjectTitle(pending.item.title, intl)
      : pending.item.name
    : ''

  const runAction = async reason => {
    if (!pending) return
    const { kind, op, item } = pending
    setBusy(true)
    try {
      if (op === 'download') {
        if (kind === 'project') {
          await downloadUserProject(userId, item.id, reason, objectName)
        } else {
          await downloadUserFile(userId, item.id, reason, item.name)
        }
        setPending(null)
        reloadAudit()
      } else {
        if (kind === 'project') {
          await deleteUserProject(userId, item.id, reason)
        } else {
          await deleteUserFile(userId, item.id, reason)
        }
        message.success(intl.formatMessage({ id: 'user_content.deleted' }, { name: objectName }))
        setPending(null)
        load()
        if (onDeleted) onDeleted()
      }
    } catch (e) {
      message.error(apiErrorMessage(e, intl))
    } finally {
      setBusy(false)
    }
  }

  const actionButtons = useCallback(
    (kind, item) => (
      <Space size={4}>
        <Button
          type='text'
          icon={<DownloadOutlined />}
          aria-label={intl.formatMessage({ id: 'user_content.download' })}
          title={intl.formatMessage({ id: 'user_content.download' })}
          onClick={() => setPending({ kind, op: 'download', item })}
        />
        <Button
          type='text'
          danger
          icon={<DeleteOutlined />}
          aria-label={intl.formatMessage({ id: 'user_content.delete' })}
          title={intl.formatMessage({ id: 'user_content.delete' })}
          onClick={() => setPending({ kind, op: 'delete', item })}
        />
      </Space>
    ),
    [intl],
  )

  const projectColumns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'user_content.col_title' }),
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        render: (title, project) => (
          <Space size={6} wrap>
            <Text>{displayProjectTitle(title, intl)}</Text>
            {project.isPublic ? (
              <Tag color='green'>
                <FormattedMessage id='user_content.public' />
              </Tag>
            ) : null}
          </Space>
        ),
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_size' }),
        dataIndex: 'sizeBytes',
        key: 'size',
        width: 100,
        render: size => formatFileSize(intl, size),
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_updated' }),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        responsive: ['md'],
        render: value => formatDateTime(value, intl.locale),
      },
      {
        key: 'actions',
        width: 88,
        align: 'right',
        render: (_, project) => actionButtons('project', project),
      },
    ],
    [actionButtons, intl],
  )

  const fileColumns = useMemo(
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
        width: 100,
        render: size => formatFileSize(intl, size),
      },
      {
        title: intl.formatMessage({ id: 'my_files.col_date' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        responsive: ['md'],
        render: value => formatDateTime(value, intl.locale),
      },
      {
        key: 'actions',
        width: 88,
        align: 'right',
        render: (_, file) => actionButtons('file', file),
      },
    ],
    [actionButtons, intl],
  )

  const auditColumns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'user_content.col_when' }),
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 140,
        render: value => formatDateTime(value, intl.locale),
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_actor' }),
        dataIndex: 'actorName',
        key: 'actor',
        width: 140,
        ellipsis: true,
        render: (name, row) => name || row.actorUserId,
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_action' }),
        dataIndex: 'action',
        key: 'action',
        width: 150,
        render: action => (
          <Tag color={DELETE_ACTIONS.has(action) ? 'red' : 'blue'}>
            {AUDIT_ACTION_MESSAGE_IDS[action]
              ? intl.formatMessage({ id: AUDIT_ACTION_MESSAGE_IDS[action] })
              : action}
          </Tag>
        ),
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_object' }),
        dataIndex: 'objectName',
        key: 'object',
        ellipsis: true,
        render: (name, row) => (
          <ObjectCell>
            <Text ellipsis title={name || row.objectId}>
              {name || row.objectId}
            </Text>
            {row.sizeBytes > 0 ? (
              <Text type='secondary' style={{ fontSize: 12 }}>
                {formatFileSize(intl, row.sizeBytes)}
              </Text>
            ) : null}
          </ObjectCell>
        ),
      },
      {
        title: intl.formatMessage({ id: 'user_content.col_reason' }),
        dataIndex: 'reason',
        key: 'reason',
        ellipsis: true,
        render: reason => <span title={reason}>{reason}</span>,
      },
    ],
    [intl],
  )

  if (loadError && !content) {
    return (
      <Alert
        type='error'
        showIcon
        title={loadError}
        action={
          <Button size='small' onClick={load}>
            <FormattedMessage id='user_content.retry' />
          </Button>
        }
      />
    )
  }

  const projects = content?.projects || []
  const files = content?.files || []
  const usage = content?.usage
  const modalIds = pending ? MODAL_IDS[`${pending.kind}.${pending.op}`] : null

  return (
    <ContentStack>
      {usage ? (
        Number(usage.storageQuotaMb) > 0 ? (
          <StorageMeter entitlements={usage} showBreakdown fullMessageId='user_content.full' />
        ) : (
          <Text type='secondary'>
            {intl.formatMessage(
              { id: 'user_content.used_unlimited' },
              {
                used: formatFileSize(intl, usage.usedBytes),
                projects: formatFileSize(intl, usage.usedBytesProjects),
                files: formatFileSize(intl, usage.usedBytesFiles),
              },
            )}
          </Text>
        )
      ) : null}

      <Tabs
        activeKey={tab}
        onChange={setTab}
        tabBarExtraContent={
          <Button
            type='text'
            icon={<ReloadOutlined />}
            aria-label={intl.formatMessage({ id: 'user_content.refresh' })}
            title={intl.formatMessage({ id: 'user_content.refresh' })}
            loading={loading && Boolean(content)}
            onClick={load}
          />
        }
        items={[
          {
            key: 'projects',
            label: intl.formatMessage(
              { id: 'user_content.tab_projects' },
              { count: projects.length },
            ),
            children: (
              <Table
                rowKey='id'
                size='small'
                columns={projectColumns}
                dataSource={projects}
                loading={loading}
                pagination={pagination(projects)}
                locale={emptyText(intl.formatMessage({ id: 'user_content.projects_empty' }))}
              />
            ),
          },
          {
            key: 'files',
            label: intl.formatMessage({ id: 'user_content.tab_files' }, { count: files.length }),
            children:
              content && !content.filesEnabled ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={intl.formatMessage({ id: 'user_content.files_disabled' })}
                />
              ) : (
                <Table
                  rowKey='id'
                  size='small'
                  columns={fileColumns}
                  dataSource={files}
                  loading={loading}
                  pagination={pagination(files)}
                  locale={emptyText(intl.formatMessage({ id: 'user_content.files_empty' }))}
                />
              ),
          },
          {
            key: 'audit',
            label: intl.formatMessage({ id: 'user_content.tab_audit' }),
            children: (
              <Table
                rowKey='id'
                size='small'
                columns={auditColumns}
                dataSource={audit}
                loading={loading}
                pagination={pagination(audit)}
                scroll={{ x: 720 }}
                locale={emptyText(intl.formatMessage({ id: 'user_content.audit_empty' }))}
              />
            ),
          },
        ]}
      />

      <ModerationReasonModal
        open={Boolean(pending)}
        title={modalIds ? intl.formatMessage({ id: modalIds.title }) : null}
        okText={modalIds ? intl.formatMessage({ id: modalIds.ok }) : null}
        placeholder={modalIds ? intl.formatMessage({ id: modalIds.placeholder }) : null}
        body={modalIds ? intl.formatMessage({ id: modalIds.body }, { name: objectName }) : null}
        warning={
          pending?.kind === 'file' && pending.op === 'download' && pending.item.hasScripts
            ? intl.formatMessage({ id: 'my_files.scripts_warning' })
            : null
        }
        danger={pending?.op === 'delete'}
        loading={busy}
        onSubmit={runAction}
        onCancel={() => setPending(null)}
      />
    </ContentStack>
  )
}

export default AdminUserContent
