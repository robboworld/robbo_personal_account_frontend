import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FolderOpenOutlined, ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Progress, Space, Table, Tag, Typography } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import { CardsGrid, StatCard, StatRow, StatTitle } from './styles'

import { getStorageOverview } from '@/api/adminStorage'
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
import { AdminUserContentDrawer } from '@/components/AdminUserContent'
import { apiErrorMessage } from '@/helpers/apiErrorMessage'
import { formatFileSize } from '@/helpers/tariffs'

const { Text } = Typography

/** 'stop' below the upload cut-off, 'alert' below the warning threshold, else 'ok'. */
export function volumeState(volume) {
  if (!volume) return 'ok'
  const free = Number(volume.freeBytes) || 0
  if (free < (Number(volume.uploadsStopBelowBytes) || 0)) return 'stop'
  if (free < (Number(volume.alertBelowBytes) || 0)) return 'alert'
  return 'ok'
}

const VOLUME_TAG = {
  stop: { color: 'error', id: 'admin_storage.volume_state_stop' },
  alert: { color: 'warning', id: 'admin_storage.volume_state_alert' },
  ok: { color: 'success', id: 'admin_storage.volume_state_ok' },
}

const Row = ({ label, value }) => (
  <StatRow>
    <span>{label}</span>
    <span>{value}</span>
  </StatRow>
)

const VolumeCard = ({ volume }) => {
  const intl = useIntl()
  const size = bytes => formatFileSize(intl, bytes)

  if (!volume) {
    return (
      <StatCard>
        <StatTitle>
          <FormattedMessage id='admin_storage.volume_title' />
        </StatTitle>
        <Text type='secondary'>
          <FormattedMessage id='admin_storage.volume_off' />
        </Text>
      </StatCard>
    )
  }

  const total = Number(volume.totalBytes) || 0
  const free = Number(volume.freeBytes) || 0
  const used = Math.max(0, total - free)
  const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  const state = volumeState(volume)
  const tag = VOLUME_TAG[state]

  return (
    <StatCard>
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <StatTitle>
          <FormattedMessage id='admin_storage.volume_title' />
        </StatTitle>
        <Tag color={tag.color}>
          <FormattedMessage id={tag.id} />
        </Tag>
      </Space>
      <Progress
        percent={percent}
        status={state === 'stop' ? 'exception' : state === 'alert' ? 'active' : 'normal'}
        format={() => `${size(used)} / ${size(total)}`}
      />
      <Row label={intl.formatMessage({ id: 'admin_storage.volume_free' })} value={size(free)} />
      <Row
        label={intl.formatMessage({ id: 'admin_storage.volume_stop' })}
        value={size(volume.uploadsStopBelowBytes)}
      />
      <Row
        label={intl.formatMessage({ id: 'admin_storage.volume_alert' })}
        value={size(volume.alertBelowBytes)}
      />
    </StatCard>
  )
}

/** Super admin: free space on the file volume, service totals, database sizes, top users. */
const AdminStorage = () => {
  const intl = useIntl()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Top row whose content is open in the drawer; the page stays where it is.
  const [contentRow, setContentRow] = useState(null)
  const contentChangedRef = useRef(false)
  const size = useCallback(bytes => formatFileSize(intl, bytes), [intl])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await getStorageOverview())
    } catch (e) {
      setError(apiErrorMessage(e, intl, 'admin_storage.load_error'))
    } finally {
      setLoading(false)
    }
  }, [intl])

  useEffect(() => {
    load()
  }, [load])

  const columns = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'admin_storage.col_user' }),
        dataIndex: 'username',
        key: 'user',
        ellipsis: true,
        render: (username, row) => (
          <Space orientation='vertical' size={0}>
            <Text strong>{username || row.userId}</Text>
            {row.fullName ? <Text type='secondary'>{row.fullName}</Text> : null}
          </Space>
        ),
      },
      {
        title: intl.formatMessage({ id: 'admin_storage.col_projects' }),
        dataIndex: 'projectsBytes',
        key: 'projects',
        width: 110,
        responsive: ['md'],
        render: size,
      },
      {
        title: intl.formatMessage({ id: 'admin_storage.col_files' }),
        dataIndex: 'filesBytes',
        key: 'files',
        width: 110,
        responsive: ['md'],
        render: size,
      },
      {
        title: intl.formatMessage({ id: 'admin_storage.col_total' }),
        dataIndex: 'totalBytes',
        key: 'total',
        width: 110,
        render: size,
      },
      {
        title: intl.formatMessage({ id: 'admin_storage.col_quota' }),
        dataIndex: 'quotaBytes',
        key: 'quota',
        width: 150,
        responsive: ['sm'],
        render: (quota, row) => {
          if (!(Number(quota) > 0)) {
            return (
              <Text type='secondary'>{intl.formatMessage({ id: 'admin_storage.no_quota' })}</Text>
            )
          }
          const percent = Math.min(100, Math.round((row.totalBytes / quota) * 100))
          return (
            <Space orientation='vertical' size={0} style={{ width: '100%' }}>
              <Text>{size(quota)}</Text>
              <Progress
                percent={percent}
                size='small'
                status={percent >= 95 ? 'exception' : 'normal'}
              />
            </Space>
          )
        },
      },
      {
        key: 'actions',
        width: 120,
        align: 'right',
        render: (_, row) => (
          <Button type='link' icon={<FolderOpenOutlined />} onClick={() => setContentRow(row)}>
            <FormattedMessage id='admin_storage.open_content' />
          </Button>
        ),
      },
    ],
    [intl, size],
  )

  const totals = data?.totals || {}
  const databases = data?.databases || {}
  const top = data?.top || []

  return (
    <PageContent>
      <Stagger variants={staggerContainer} initial='hidden' animate='show'>
        <HeroPanel variants={staggerItem}>
          <HeroInner>
            <HeroTitle>
              <FormattedMessage id='admin_storage.title' />
            </HeroTitle>
            <HeroLead>
              <FormattedMessage id='admin_storage.lead' />
            </HeroLead>
          </HeroInner>
        </HeroPanel>

        {error ? (
          <motion.div variants={staggerItem}>
            <Alert
              type='error'
              showIcon
              title={error}
              action={
                <Button size='small' onClick={load}>
                  <FormattedMessage id='user_content.retry' />
                </Button>
              }
            />
          </motion.div>
        ) : null}

        <motion.div variants={staggerItem}>
          <GlassPanel>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='admin_storage.summary_title' />
              </SectionTitle>
              <Button icon={<ReloadOutlined />} loading={loading} onClick={load}>
                <FormattedMessage id='admin_storage.refresh' />
              </Button>
            </SectionHeader>
            {data ? (
              <CardsGrid>
                <VolumeCard volume={data.volume} />
                <StatCard>
                  <StatTitle>
                    <FormattedMessage id='admin_storage.totals_title' />
                  </StatTitle>
                  <Row
                    label={intl.formatMessage(
                      { id: 'admin_storage.totals_projects' },
                      { count: Number(totals.projectCount) || 0 },
                    )}
                    value={size(totals.projectsBytes)}
                  />
                  <Row
                    label={intl.formatMessage(
                      { id: 'admin_storage.totals_files' },
                      { count: Number(totals.fileCount) || 0 },
                    )}
                    value={size(totals.filesBytes)}
                  />
                  <Row
                    label={intl.formatMessage({ id: 'admin_storage.totals_owners' })}
                    value={intl.formatNumber(Number(totals.ownersWithData) || 0)}
                  />
                </StatCard>
                <StatCard>
                  <StatTitle>
                    <FormattedMessage id='admin_storage.databases_title' />
                  </StatTitle>
                  <Row
                    label={intl.formatMessage({ id: 'admin_storage.db_projects' })}
                    value={size(databases.projectsBytes)}
                  />
                  <Row
                    label={intl.formatMessage({ id: 'admin_storage.db_licensing' })}
                    value={size(databases.licensingBytes)}
                  />
                </StatCard>
              </CardsGrid>
            ) : null}
          </GlassPanel>
        </motion.div>

        <motion.div variants={staggerItem}>
          <GlassPanel>
            <SectionHeader>
              <SectionTitle>
                <FormattedMessage id='admin_storage.top_title' />
              </SectionTitle>
            </SectionHeader>
            <Table
              rowKey='userId'
              size='middle'
              columns={columns}
              dataSource={top}
              loading={loading}
              pagination={top.length > 20 ? { pageSize: 20, showSizeChanger: false } : false}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={intl.formatMessage({ id: 'admin_storage.top_empty' })}
                  />
                ),
              }}
            />
          </GlassPanel>
        </motion.div>
      </Stagger>

      <AdminUserContentDrawer
        userId={contentRow?.userId}
        user={contentRow}
        onDeleted={() => {
          contentChangedRef.current = true
        }}
        onClose={() => {
          setContentRow(null)
          // A delete in the drawer changes the totals and the top.
          if (contentChangedRef.current) {
            contentChangedRef.current = false
            load()
          }
        }}
      />
    </PageContent>
  )
}

export default AdminStorage
